
import { body } from 'express-validator';
import { extractValidationErrors } from '../util/util'

const validateCreateTodo = [
   body('content')
      .notEmpty()
      .withMessage('Please provide todo content.'),

   extractValidationErrors   
]

const validateUpdateTodo = [
   body('isDone')
      .isBoolean()
      .withMessage('Please specify todo done.'),

   body('todoId')
      .notEmpty()
      .withMessage('Please specify corresponding todo.'),
   
   extractValidationErrors   
]

const validateDeleteTodo = [
   body('todoId')
   .notEmpty()
   .withMessage('Please specify corresponding todo.'),
  
   extractValidationErrors   
]

export {
   validateCreateTodo,
   validateUpdateTodo,
   validateDeleteTodo
}