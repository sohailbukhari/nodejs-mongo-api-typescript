import { User } from '../../models';
import * as RedisController from '../redis/redis.controller';

import { lock, verify } from '../../utils/locker';
import { UserIF } from 'src/types/UserIF';

export const setRedisUser = (user: UserIF) => RedisController.setKey('User', user._id, JSON.stringify(user));
export const getRedisUser = (_id: string) => RedisController.getKey('User', _id);

export const setRedisPasswordResetToken = (_id: string, token: string) => RedisController.setKey('Password-Reset-Token', _id, token, 60 * 60); // expire in 1 hr
export const getRedisPasswordResetToken = (_id: string) => RedisController.getKey('Password-Reset-Token', _id);
export const delRedisPasswordResetToken = (_id: string) => RedisController.delKey('Password-Reset-Token', _id);

// retrieve single user
export const get = async ({ sub, args = {} }: any) => {
  const user = await User.findOne({ _id: sub, ...args });

  if (user) setRedisUser(user);

  return user;
};

// update self / admin can update specific user
export const update = async ({ sub, args, isAdmin }: any) => {
  let _id = args._id ? args._id : sub;

  if (!isAdmin) {
    _id = sub; // owner
    delete args['role'];
    delete args['_id'];
  }
  return User.findOneAndUpdate({ _id }, args, { new: true });
};

// user login
export const login = async (args: any) => {
  const user = await User.findOne(args);

  if (!user) throw { status: 401, message: 'Invalid Credentials' };

  const { role, _id } = user;

  const access_token = lock({ role, sub: _id, type: 'access' });
  const refresh_token = lock({ sub: _id, type: 'refresh' }, 60 * 48);

  return { access_token, refresh_token };
};

// creates new accessToken for the user
export const accessToken = async ({ sub, type }: any) => {
  if (type !== 'refresh') throw { status: 401 };

  const user = await User.findOne({ _id: sub });

  if (!user) throw { status: 401 };

  const { role, _id } = user;

  const access_token = lock({ role, sub: _id });

  return { access_token };
};

// user registration
export const register = async (args: any) => {
  const count = await User.countDocuments();

  if (count === 0) {
    args.role = 'admin';
  } else args.role = 'user';

  const user = await User.create(args);

  setRedisUser(user);

  return user;
};

// issue password reset key
export const forgot = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) throw { status: 404 };

  const { _id, first_name, last_name } = user;

  const token = lock({ email, sub: _id, type: 'reset' }, 60); // expires in 1 hr

  console.log('Password Reset: ', {
    reset_token: token,
  });

  setRedisPasswordResetToken(_id, token);

  return { first_name, last_name };
};

// reset password
export const reset = async (token: string, password: string) => {
  const { email, sub, type }: any = await verify(token);

  if (type !== 'reset' || !(await getRedisPasswordResetToken(sub))) throw { status: 401, message: 'The token is invalid or used already' };

  await User.findOneAndUpdate({ email }, { password });

  delRedisPasswordResetToken(sub);

  return { reset: 'Successfull' };
};
