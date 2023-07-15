import { createLogger, format, transports } from 'winston';

const { timestamp, printf, combine, colorize } = format;

const showcase = () =>
  printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level} : ${typeof message === 'object' ? JSON.stringify(message, null, 2) : message}`;
  });

const CombinePrint = combine(colorize(), timestamp(), showcase());

const logger = createLogger({ format: CombinePrint });

// adding console options to transport layer
const options = { console: { format: CombinePrint, handleExceptions: true } };

logger.add(new transports.Console(options.console));

export default logger;
