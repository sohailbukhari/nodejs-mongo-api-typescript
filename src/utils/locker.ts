import { Request } from 'express';
import jwt from 'jsonwebtoken';

import keys from '../config/keys';

const issuer = 'cheggl.com';

export const unlock = async (request: Request) => {
  let authHeader = request.headers['authorization'] || '';
  const tokenType = 'Bearer ';
  if (typeof authHeader === 'undefined' || !authHeader.includes(tokenType)) {
    throw Error('Authentication token missing');
  }
  authHeader = authHeader.replace(tokenType, '');

  return jwt.verify(authHeader, keys.secret, { algorithms: ['HS256'], issuer });
};

export const lock = (obj: any, time: number = 25, expiry: boolean = true) => {
  // define the expiry timeframe
  const args: any = { algorithm: 'HS256', issuer };
  if (expiry) {
    args['expiresIn'] = 60 * time;
  }
  return jwt.sign(obj, keys.secret, args);
};

export const verify = async (token: string) => jwt.verify(token, keys.secret, { algorithms: ['HS256'], issuer });
