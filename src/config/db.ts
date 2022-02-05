import mongoose from 'mongoose';
import { createClient } from 'redis';

import keys from './keys';

const message = (msg: string) => console.log(`------------ Success: ${msg} ------------`);

export const RedisClient = createClient();

export const init = async () => {
  await mongoose.connect(keys.mongodb);
  message('Mongodb');

  await RedisClient.connect();
  message('Redis');
};

export default mongoose.connection;
