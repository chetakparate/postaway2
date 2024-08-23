// implementing logger

import winston from "winston";

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
});

export const logGenerator = (req, res, next) => {
    const data = `"Timestamp" : ${new Date().toString()}, ` +
                  `"Request URL" : ${req.originalUrl}, ` +
                  `"Request Body" : ${JSON.stringify(req.body)}`;
    logger.info(JSON.stringify(data));
    next();
  }