import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './app/routes/todo.routes.js';
import db from './app/config/db.config.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', todoRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Todos API' });
});

app.listen(port, () => {
  console.log(`Server is up and running on ${port}`);
});
