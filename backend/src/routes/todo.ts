// imports
import { Router } from 'express'
const routerAuth = Router()

// middlewares
import authenticated from '../middleware/authenticated' 

// methods
import { createTodo, updateTodo, deleteTodo, retrieveTodos } from '../controller/todo'

// validations
import { validateCreateTodo, validateUpdateTodo, validateDeleteTodo } from '../validation/todo'

// routes
routerAuth.use(authenticated)
routerAuth.get('/', retrieveTodos)
routerAuth.post('/', validateCreateTodo, createTodo)
routerAuth.patch('/', validateUpdateTodo, updateTodo)
routerAuth.delete('/', validateDeleteTodo, deleteTodo)

export default routerAuth