import { env } from '../env_setup/setup.js';
import express from 'express';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import expressWinston from 'express-winston';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { CarPositionRequest } from '../env_setup/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurazione base di Winston
const customFormat = winston.format.printf(({ level, message,timestamp, ...meta }) => {
    const cleanMeta = { ...meta };
  delete cleanMeta.level;
  delete cleanMeta.timestamp;
    // Aggiunge i meta solo se presenti
  const metaString = Object.keys(cleanMeta).length ? ` ${JSON.stringify(cleanMeta)}` : '';
  
  return `[${timestamp}] [${level.toUpperCase()}] message: ${message}${metaString}`;
  });

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json(),
    customFormat
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
            winston.format.simple()
          )
    })
  ]
});

// Funzioni helper per il logging
export const logHelper = {
  info: (message: string, meta: object = {}) => {
    logger.info(message, {...meta });
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
    logger.warn(message, { ...meta });
  },
  debug: (message: string, meta: object = {}) => {
    logger.debug(message, { ...meta });
  }
};

// Setup Express con Winston
const app = express();
// IMPORTANTE: questo deve venire PRIMA delle routes
app.use(express.json());

// Middleware per loggare le richieste
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false
}));

// Esempio di middleware per gestione errori con logging
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logHelper.error('Error in request'+req.body, err);
  res.status(500).json({ error: 'Internal Server Error' });
};

app.use(errorHandler);

// Esempio di utilizzo
app.get('/test', (req: Request, res: Response) => {
    logHelper.info('Test endpoint called', { 
        query: req.query
    });
    res.json({ message: 'Test successful' });
});

app.post('/setCarPosition', (req: Request,res:Response)=> {
    logHelper.info('setCarPosition request:', { 
        body: req.body, test: "test"
    });
    try {
         const { owner, position } = req.body as CarPositionRequest;
    
//         // Validazione dei dati
        if (!owner || !position) {
            logHelper.error('Missing required fields in request', 'Owner and position are required');
          res.status(400).json({
            success: false,
            error: 'Missing required fields: owner and position are required'
          });
          return;
        }
//         // Log della richiesta
        logHelper.info('Setting car position', { owner, position });
//    // Qui inserisci la logica per gestire la posizione
//     // Per esempio, salvarla in un database

//     // Risposta di successo
    res.status(200).json({
        success: true,
        message: 'Car position updated successfully',
        data: { owner, position }
      });
  
    } catch (error) {
         logHelper.error('Error processing setCarPosition request', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
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