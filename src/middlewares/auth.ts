import { RequestHandler } from 'express';

import { unlock } from '../utils/locker';

export const strict: RequestHandler = async (request: any, response: any, next) => {
  try {
    const token: any = await unlock(request);
    if (token.role) {
      request.token = token;
      request.isAdmin = token.role === 'admin';
      next();
    } else throw { status: 401 };
  } catch (err) {
    next(err);
  }
};

export const locked: RequestHandler = async (request: any, response: any, next) => {
  try {
    const token: any = await unlock(request);
    if (!token.role) {
      request.token = token;
      next();
    } else throw { status: 401 };
  } catch (err) {
    next(err);
  }
};

export const isAdmin: RequestHandler = async (request: any, response: any, next) => {
  try {
    const token: any = await unlock(request);
    if (token.role === 'admin') {
      request.token = token;
      next();
    } else throw { status: 401 };
  } catch (err) {
    next(err);
  }
};
