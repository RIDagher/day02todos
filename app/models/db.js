import mysql from 'mysql2';
import dotenv from 'dotenv';
import logger from '/Users/rimadagher/Documents/JohnAbbott-FSD/Web_Services_2024/day02todos/app/utils/logger.js';

dotenv.config(); // Load .env variables

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    logger.error('Database connection failed:', err.message);
    process.exit(1); // Exit if database connection fails
  } else {
    logger.info('Connected to MySQL database.');
  }
});

export default db;
