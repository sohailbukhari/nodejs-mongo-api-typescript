import { promisify } from 'util';
import RedisClient from '../../config/redis';

const set = promisify(RedisClient.set).bind(RedisClient);
const get = promisify(RedisClient.get).bind(RedisClient);
const expire = promisify(RedisClient.expire).bind(RedisClient);

export const setKey = async (prefix: string, key: string, value: any, expireIn: number = 30) => {
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
