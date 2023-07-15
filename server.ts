import dotenv from 'dotenv';
import * as service from './app';
import logger from './src/utils/logger';

const app = service.default;

dotenv.config();

const normalizePort = (val: any) => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const port = normalizePort(process.env.PORT || 4000);
app.set('port', port);

// const server = http.createServer(app);

const onError = (error: any) => {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? `Pipe  ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;

    case 'ECONNREFUSED':
      logger.error(`Unable to Connect ${error.address} : ${error.port}`);
    default:
      throw error;
  }
};

(async () => {
  await service.init();

  app.listen(port, () => {
    logger.info(`Server running on http://localhost:${port}`);
  });

  app.on('error', onError);
})();
