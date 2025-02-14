import db from '../models/db.js';
import Todo from '../models/todo.model.js';
import logger from '../utils/logger.js';
import { validateTodo } from '../utils/validator.js';

// Get All Todos
export const getAllTodos = (req, res) => {
  logger.info('Fetching all todos...');

  Todo.getAll((err, data) => {
    if (err) {
      logger.error(`Error fetching todos: ${err.message}`, { error: err });
      return res.status(500).json({ message: 'Error fetching todos' });
    }

    logger.info(`Fetched ${data.length} todos`);
    return res.status(200).json(data);
  });
};

// Get Todo By ID
export const getTodoById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  logger.info(`Received request for todo with ID: ${id}`);

  if (isNaN(id)) {
    logger.warn(`Invalid ID format: ${req.params.id}`);
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  Todo.getTodoById(id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.warn(`Todo with ID ${id} not found`);
        return res
          .status(404)
          .json({ message: `Todo with ID ${id} not found` });
      } else {
        logger.error(`Error retrieving Todo with ID ${id}: ${err.message}`, {
          error: err,
        });
        return res
          .status(500)
          .json({ message: 'Error retrieving Todo', error: err.message });
      }
    }
    res.status(200).json(data);
  });
};

// Create Todo
export const createTodo = (req, res) => {
  logger.info(`Received request to create a Todo: ${JSON.stringify(req.body)}`);

  const validationError = validateTodo(req.body);
  if (validationError) {
    logger.warn(`Validation failed: ${validationError}`);
    return res.status(400).json({ message: validationError });
  }

  const newTodo = {
    task: req.body.task,
    dueDate: req.body.dueDate,
    isDone: req.body.isDone || 'Pending',
  };

  Todo.create(newTodo, (err, data) => {
    if (err) {
      logger.error(`Error inserting todo: ${err.message}`, { error: err });
      return res
        .status(500)
        .json({ message: 'Error inserting todo', error: err.message });
    }
    logger.info(`Todo created with ID ${data.id}: ${JSON.stringify(data)}`);
    res.status(201).json(data);
  });
};

// Update Todo
export const updateTodo = (req, res) => {
  const id = parseInt(req.params.id, 10);
  logger.info(`Received request to update todo with ID ${id}`);

  if (isNaN(id)) {
    logger.warn(`Invalid ID format: ${req.params.id}`);
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const validationError = validateTodo(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const updatedTodo = {
    task: req.body.task,
    dueDate: req.body.dueDate,
    isDone: req.body.isDone || 'Pending',
  };

  Todo.updateById(id, updateTodo, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.warn(`Todo with ID ${id} not found for update`);
        return res
          .status(404)
          .json({ message: `Todo with ID ${id} not found in database` });
      }
      logger.error(`Error updating Todo with ID ${id}: ${err.message}`, {
        error: err,
      });
      return res
        .status(500)
        .json({ message: 'Error updating Todo', error: err.message });
    }
    logger.info(`Todo with ID ${id} was updated`);
    return res.status(200).json({ success: true });
  });
};

// Delete Todo
export const deleteTodo = (req, res) => {
  const id = parseInt(req.params.id, 10);
  logger.info(`Received request to delete todo with ID ${id}`);

  if (isNaN(id)) {
    logger.warn(`Invalid ID format: ${id}`);
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  Todo.deleteById(id, (err) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.warn(`Attempted to delete non-existing Todo with ID: ${id}`);
        return res
          .status(404)
          .json({ message: `Todo with ID ${id} not found in database` });
      }
      logger.error(`Error deleting Todo with ID ${id}: ${err.message}`, {
        error: err,
      });
      return res
        .status(500)
        .json({ message: 'Error deleting Todo', error: err.message });
    }
    logger.info(`Todo with ID ${id} was deleted`);
    return res.status(200).json({ success: true });
  });
};
