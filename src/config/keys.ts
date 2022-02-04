import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'production') {
  dotenv.config();
}

export default {
  dev: process.env.NODE_ENV !== 'production',
  secret: process.env.SECRET || 'sohxil@loop(^^4&d%#!@secret',
  mongodb: process.env.DATABASE || 'mongodb://localhost:27017/cheggl',
};
