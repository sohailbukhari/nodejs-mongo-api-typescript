import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import response from './src/middlewares/response';
import routes from './src/config/routes';
import keys from './src/config/keys';
import logger from './src/utils/logger';

import * as database from './src/config/db';

const app = express();

export const init = async () => {
  // cold start services first
  await database.init();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(response);
  app.use(cors());
  app.use(morgan(keys.dev ? 'dev' : 'combined'));

  routes(app);

  // catch 404 and forward to error handler
  app.use((req, res: any) => {
    res.reply({ statusCode: 404 });
  });

  // error handler
  app.use((err: any, req: any, res: any, next: any) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    // res.locals.error = req.app.get("env") === "development" ? err : {};

    if (err.error || err.hasOwnProperty('errors') || err.name === 'MongoError') {
      err.status = 422;
    }

    const body = {
      message: err.message,
      statusCode: err.status || 400,
      data: err.hasOwnProperty('errors') ? err.errors : err.name === 'MongoError' ? err : err.error ? err.error.details : err.details,
    };

    logger.error(`${body.statusCode} - ${body.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.reply(body);

    next();
  });
};

export default app;
