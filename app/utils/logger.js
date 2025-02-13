import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import 'winston-daily-rotate-file';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log rotation settings
const transport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, '../../logs/app-%DATE%.log'), // Log file pattern
  datePattern: 'YYYY-MM-DD', // Rotate daily
  maxSize: '10m', // Max size per file (10MB)
  maxFiles: '14d', // Keep logs for 14 days
  zippedArchive: true, // Compress old logs
});

// Create logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ level, message, timestamp }) =>
        `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    transport, // Saves logs to rotating files
    new winston.transports.Console(), // Also logs to console
  ],
});

export default logger;
