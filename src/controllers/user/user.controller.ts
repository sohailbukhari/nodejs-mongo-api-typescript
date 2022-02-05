import { User } from '../../models';
import * as RedisController from '../redis/redis.controller';

import { filterQuery } from '../../utils/common';
import { lock } from '../../utils/locker';

import { Role, UserIF, UserPayloadIF } from '../../types/UserIF';
import { ClientIF } from '../../types/AuthIF';
import { randomUUID } from 'crypto';

const filters = ['role', 'email'];

const Paginator = (Modal: any, ...args: any) => Modal.paginate(...args);

export const calculateReport = async () => {
  let report;

  report = await User.aggregate([
    {
      $group: { _id: '$role', count: { $sum: 1 } },
    },
  ]);
  await RedisController.setUserReport(report);

  return report;
};

export const report = async () => {
  let report;

  report = await RedisController.getUserReport();

  if (!report) {
    report = await calculateReport();
  } else {
    report = JSON.parse(report);
  }

  return report;
};

export const bulkCreate = async (user: any) => {
  return User.create(user);
};

export const get = async (_id: string) => {
  let user: UserIF, instance, cache;

  cache = await RedisController.getUser(_id);

  if (!cache) {
    instance = await User.findOne({ _id });
    if (!instance) throw { status: 404, message: 'USER NOT FOUND' };
    user = instance.toJSON();
    RedisController.setUser(_id, user);
  } else user = JSON.parse(cache);

  return user;
};

export const list = async (query: any) => {
  const payload = filterQuery(query, filters);
  return Paginator(User, { ...payload.args }, { sort: { createdAt: -1 }, ...payload.query });
};

export const update = async (client: ClientIF, _id: string, payload: UserPayloadIF) => {
  let instance;

  if (client.role !== Role.ADMIN) {
    delete payload['role'];
  }

  if (client.sub === _id && payload.role) throw { status: 403, message: 'NOT ALLOWED TO CHANGE OWN ROLE' };

  instance = await User.findOneAndUpdate({ _id }, payload, { new: true });
  RedisController.delUser(_id);

  // generate new report
  if (payload.role && payload.role !== instance?.role) calculateReport();

  return instance;
};

export const login = async (credentials: UserIF) => {
  const { email, password } = credentials;

  const user = await User.findOne({ $and: [{ email }, { password }] });

  if (!user) throw { status: 401, message: 'INVALID CREDENTIALS' };

  RedisController.setUser(user._id, user);

  const { role, _id } = user;

  const access_token = lock({ role, sub: _id }, 60 * 2); // expire in 2 hours

  return { access_token };
};

export const register = async (args: UserIF) => {
  const count = await User.countDocuments();

  if (count === 0) {
    args.role = Role.ADMIN;
  } else args.role = Role.USER;

  const user = await User.create(args);

  const code = randomUUID();
  console.log('User Verificaton: ', { code, expire_in: 60 * 60 * 24 });
  RedisController.setVerificationCode(user.email, code); // expire in 24 hour
  RedisController.delUserReport();

  return user;
};

export const forgot = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) throw { status: 404 };

  const { name } = user;

  const code = randomUUID();

  console.log('Password Reset: ', { code, expire_in: 60 * 60 });

  RedisController.setResetCode(email, code); // expire in 1 hour

  return { name };
};

export const reset = async ({ code, email }: any, password: string) => {
  const resetCode = await RedisController.getResetCode(email);

  if (code !== resetCode) throw { status: 401, message: 'CODE INVALID OR EXPIRED' };

  await User.findOneAndUpdate({ email }, { password });

  RedisController.delResetCode(email);

  return { reset: 'YOUR PASSWORD HAS BEEN RESET SUCCESSFULLY' };
};

export const verification = async ({ code, email }: any) => {
  const verifyCode = await RedisController.getVerificationCode(email);

  if (code !== verifyCode) throw { status: 401, message: 'CODE INVALID OR EXPIRED' };

  const user = await User.findOneAndUpdate({ email }, { verified_email: true }, { new: true });

  RedisController.delVerificationCode(email);
  RedisController.delUser(user?._id);

  return { reset: 'YOUR ACCOUNT HAS BEEN VERIFIED SUCCESSFULLY' };
};
