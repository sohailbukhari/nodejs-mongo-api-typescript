import mongoose from 'mongoose';
import { createClient } from 'redis';

import logger from '../utils/logger';

import keys from './keys';

const message = (msg: string) => logger.info(`SUCCESS | ${msg} Service`);

export const RedisClient = createClient();

export const init = async () => {
  await mongoose.connect(keys.mongodb);
  message('Mongodb');
  RedisClient.connect();
};

RedisClient.on('ready', () => message('Redis'));
RedisClient.on('error', (err) => logger.error('Redis refused to connect'));

export default mongoose.connection;
