import express from 'express';
import logger from 'morgan';
import cors from 'cors';

import response from './src/middlewares/response';
import routes from './src/config/routes';

require('./src/config/db');
require('./src/config/redis');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(response);
app.use(cors());
app.use(logger('dev'));

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

  res.reply({
    message: err.message,
    statusCode: err.status || 400,
    data: err.hasOwnProperty('errors') ? err.errors : err.name === 'MongoError' ? err : err.error ? err.error.details : err.details,
  });
  next();
});

export default app;