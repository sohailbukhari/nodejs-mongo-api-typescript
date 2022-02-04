import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { timestamp, printf, combine, colorize } = format;

const showcase = () =>
  printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level} : ${typeof message === 'object' ? JSON.stringify(message) : message}`;
  });

const CombinePrint = combine(colorize(), timestamp(), showcase());

if (0) {
  const keeper: DailyRotateFile = new DailyRotateFile({
    filename: 'cheggl-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '50m',
    maxFiles: '1',
    utc: true,
  });

  keeper.on('rotate', function (oldFileName, newFileName) {
    // todo - integration here
  });
}

const logger = createLogger({ format: CombinePrint });

var options = {
  console: { format: CombinePrint, handleExceptions: true },
};

logger.add(new transports.Console(options.console));

export default logger;
