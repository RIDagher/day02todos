export const validateTodo = (todo) => {
  if (!todo.task || todo.task.length < 1 || todo.task.length > 100) {
    return 'Task must be 1-100 characters long.';
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(todo.dueDate)) {
    return 'dueDate must be in YYYY-MM-DD format.';
  }

  const year = parseInt(todo.dueDate.split('-')[0], 10);
  if (year < 1900 || year > 2099) {
    return 'dueDate year must be between 1900 and 2099.';
  }

  if (todo.isDone && !['Pending', 'Done'].includes(todo.isDone)) {
    return "isDone must be either 'Pending' or 'Done'.";
  }

  return null;
};
