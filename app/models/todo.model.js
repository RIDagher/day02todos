import db from './db.js';
import logger from '../utils/logger.js';
import moment from 'moment';

// Constructor function
const Todo = function (todo) {
  this.task = todo.task;
  this.dueDate = moment(todo.dueDate, 'YYYY-MM-DD').format('YYYY-MM-DD'); // Ensure format
  this.isDone = todo.isDone;
};

// Fetch all todos
Todo.getAll = (result) => {
  db.query('SELECT * FROM todos', (err, res) => {
    if (err) {
      logger.error(`Database error: ${err.message}`);
      return result(err, null);
    }
    // Format dueDate before sending response
    const formattedTodos = res.map((todo) => ({
      ...todo,
      dueDate: moment(todo.dueDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
    }));

    logger.info(`Fetched ${formattedTodos.length} todos from DB`);
    result(null, formattedTodos);
  });
};

// Fetch Todo By ID
Todo.getTodoById = (id, result) => {
  db.query('SELECT * FROM todos WHERE id = ?', [id], (err, res) => {
    if (err) {
      logger.error(`Database error: ${err.message}`);
      return result(err, null);
    }

    if (res.length) {
      res[0].dueDate = moment(res[0].dueDate, 'YYYY-MM-DD').format(
        'YYYY-MM-DD'
      ); // Ensure correct format
      logger.info(`Todo found: ${JSON.stringify(res[0])}`);
      return result(null, res[0]); // Return single object
    }

    logger.warn(`Todo with ID ${id} not found`);
    return result({ kind: 'not_found' }, null);
  });
};

// Create TODO
Todo.create = (newTodo, result) => {
  db.query('INSERT INTO todos SET ?', newTodo, (err, res) => {
    if (err) {
      logger.error(`Database Error: ${err.message}`);
      return result(err, null);
    }
    logger.info(
      `Todo created: ${JSON.stringify({ id: res.insertId, ...newTodo })}`
    );
    result(null, { id: res.insertId, ...newTodo });
  });
};

// Update Todo
Todo.updateById = (id, todo, result) => {
  db.query(
    'UPDATE todos SET task = ?, dueDate = ?, isDone = ? WHERE id = ?',
    [todo.task, todo.dueDate, todo.isDone, id],
    (err, res) => {
      if (err) {
        logger.error(`Database error: ${err.message}`);
        return result(err, null);
      }
      if (res.affectedRows === 0) {
        logger.warn(`Todo with ID ${id} not found`);
        return result({ kind: 'not_found' }, null);
      }
      logger.info(`Todo updated: ${JSON.stringify({ id, ...todo })}`);
      result(null, { id, ...todo });
    }
  );
};

// Delete Todo
Todo.deleteById = (id, result) => {
  db.query('DELETE FROM todos WHERE id = ?', [id], (err, res) => {
    if (err) {
      logger.error(`Database error: ${err.message}`);
      return result(err, null);
    }
    if (res.affectedRows === 0) {
      logger.warn(`Todo with ID ${id} not found`);
      return result({ kind: 'not_found' }, null);
    }
    logger.info(`Todo with ID ${id} deleted successfully`);
    result(null, { success: true });
  });
};

export default Todo;
