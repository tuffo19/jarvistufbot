import { env } from '../env_setup/setup.js';
import express from 'express';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import expressWinston from 'express-winston';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurazione base di Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
     // Rotazione per i log di errore
     new DailyRotateFile({
        filename: path.join(__dirname,'..', '..','logs','error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '500m',      // Ruota a 500MB
        maxFiles: 3,          // Mantiene solo 3 file
        zippedArchive: true   // Comprime i file archiviati
      }),
    new DailyRotateFile({
        filename: path.join(__dirname,'..', '..','logs','application-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '500m',      // Ruota a 500MB
        maxFiles: 3,          // Mantiene solo 3 file
        zippedArchive: true   // Comprime i file archiviati
      }),
    // Log sulla console in development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Funzioni helper per il logging
export const logHelper = {
  info: (message: string, meta: object = {}) => {
    logger.info(message, meta);
  },
  error: (message: string, error: Error | unknown) => {
    if (error instanceof Error) {
      logger.error(message, {
        error: error.message,
        stack: error.stack
      });
    } else {
      logger.error(message, { error });
    }
  },
  warn: (message: string, meta: object = {}) => {
    logger.warn(message, meta);
  },
  debug: (message: string, meta: object = {}) => {
    logger.debug(message, meta);
  }
};

// Setup Express con Winston
const app = express();

// Middleware per loggare le richieste
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: true
}));

// Esempio di middleware per gestione errori con logging
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logHelper.error('Error in request', err);
  res.status(500).json({ error: 'Internal Server Error' });
};

app.use(errorHandler);

// Esempio di utilizzo
app.get('/test', (req: Request, res: Response) => {
  logHelper.info('Test endpoint called', { 
    query: req.query,
    timestamp: new Date().toISOString()
  });
  res.json({ message: 'Test successful' });
});

// Logging degli errori non gestiti
process.on('uncaughtException', (error: Error) => {
  logHelper.error('Uncaught Exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logHelper.error('Unhandled Rejection', reason);
});

const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  logHelper.info(`Server started on port ${PORT}`);
});

export { logger, app };