import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'production') {
  dotenv.config();
}

export default {
  secret: process.env.SECRET || 'hyper@loop(^^4&23encrtyped%#!@secret',
  mongodb: process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/sys-identity',
};
