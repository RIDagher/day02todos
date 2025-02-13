import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './app/routes/todo.routes.js';
import logger from './app/utils/logger.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api', todoRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Todos API' });
});

// Start the server
app.listen(port, () => {
  logger.info(` Server running on port ${port}`);
});
