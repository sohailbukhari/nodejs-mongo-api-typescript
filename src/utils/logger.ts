import { createLogger, format, transports } from 'winston';

import keys from '../config/keys';

const { prettyPrint, timestamp, printf, combine, colorize, json } = format;

const showcase = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level} : ${typeof message === 'object' ? JSON.stringify(message) : message}`;
});

const display = combine(timestamp(), json(), colorize(), showcase);

const logger = createLogger({ format: display });

if (keys.dev) {
  logger.add(new transports.Console({ format: display }));
} else {
  logger.add(new transports.File({ filename: __dirname + '../../../logs/combined.log' }));
}

export default logger;
