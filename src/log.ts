import winston, { format } from 'winston';

// Configuration des logs
const logFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level.toUpperCase()}: ${message}`;
});

const logger = winston.createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    new winston.transports.File({ filename: 'server.log' })
  ]
});

export function info(prefix: string, message?: string) {
  logger.info(`${prefix.toUpperCase()} ${message || ''}`);
}

export function debug(prefix: string, message?: string) {
  logger.debug(`${prefix.toUpperCase()} ${message || ''}`);
}