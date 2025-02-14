import moment from 'moment';

// Validate if the date is in YYYY-MM-DD format
export const isValidDate = (dateString) => {
  return moment(dateString, 'YYYY-MM-DD', true).isValid();
};

// Main validation function
export const validateTodo = (todo) => {
  if (!todo.task || todo.task.length < 1 || todo.task.length > 100) {
    return 'Task must be 1-100 characters long.';
  }

  // Check if dueDate is provided and in valid format
  if (!todo.dueDate || !isValidDate(todo.dueDate)) {
    return 'Due date must be in YYYY-MM-DD format.';
  }

  // Extract the year and ensure it's between 1900-2099
  const year = parseInt(todo.dueDate.split('-')[0], 10);
  if (year < 1900 || year > 2099) {
    return 'Due date year must be between 1900 and 2099.';
  }

  // Ensure isDone is either 'Pending' or 'Done'
  if (todo.isDone && !['Pending', 'Done'].includes(todo.isDone)) {
    return "isDone must be either 'Pending' or 'Done'.";
  }

  return null; // No validation errors
};
