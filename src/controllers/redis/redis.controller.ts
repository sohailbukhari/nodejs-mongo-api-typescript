import { promisify } from 'util';
import { RedisClient } from '../../config/db';

import { UserIF } from 'src/types/UserIF';

const { get, set, expire } = RedisClient;

export const setKey = async (prefix: string, key: string, value: any, expireIn: number = 60) => {
  const pair = prefix + '-' + key;
  await set(pair, value);
  await expire(pair, expireIn);
};

export const getKey = async (prefix: string, key: string) => {
  return get(prefix + '-' + key);
};

export const delKey = async (prefix: string, key: string) => {
  return RedisClient.del(prefix + '-' + key);
};

const USER = 'USER';

export const getUser = async (id: string) => getKey(USER, id);
export const setUser = async (id: string, user: UserIF) => setKey(USER, id, JSON.stringify(user));
export const delUser = async (id: string) => delKey(USER, id);

const VERIFICATION = 'VERIFICATION';

export const getVerificationCode = async (id: string) => getKey(VERIFICATION, id);
export const setVerificationCode = async (id: string, code: string) => setKey(VERIFICATION, id, code, 60 * 60 * 24);
export const delVerificationCode = async (id: string) => delKey(VERIFICATION, id);

const PASSWORD_RESET = 'RESET-CODE';

export const getResetCode = async (_id: string) => getKey(PASSWORD_RESET, _id);
export const delResetCode = (_id: string) => delKey(PASSWORD_RESET, _id);
export const setResetCode = (_id: string, code: string) => setKey(PASSWORD_RESET, _id, code, 60 * 60); // expire in 1 hr
