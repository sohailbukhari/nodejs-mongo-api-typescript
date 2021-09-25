import dotenv from 'dotenv';
import app from './app';

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
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

app.listen(port, () => {
  console.log(`Server app is running on port: ${port}...`);
});

app.on('error', onError);