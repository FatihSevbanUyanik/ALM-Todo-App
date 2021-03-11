// imports
import { isMatching } from '../util/util';
import { ApiError } from '../util/ApiError';
import { catchAsync } from '../util/errorHandling';
import { Request, Response, NextFunction } from 'express';

// requests
import { 
   RequestCreateTodo, 
   RequestDeleteTodo, 
   RequestUpdateTodo } from '../request/todo';

// model
import { UserDoc } from '../model/user';
import Todo from '../model/todo';


/**
 * Creates todo and registers to db.
 * @param req is a request object.
 * @param res is a response object.
 * @param next is the next middleware.
 */
let createTodo = async (req: Request, res: Response, next: NextFunction) => {
   const body: RequestCreateTodo = req.body;
   const currentUser: UserDoc = req.body.currentUser;

   const todo = Todo.build({
      content: body.content,
      userId: currentUser._id 
   });

   await todo.save();

   res.status(200).json({
      status: 200,
      data: { todo },
   });
};


/**
 * Retrieves todo and registers to db.
 * @param req is a request object.
 * @param res is a response object.
 * @param next is the next middleware.
 */
let retrieveTodos = async (req: Request, res: Response, next: NextFunction) => {
   const currentUser: UserDoc = req.body.currentUser;
   const todos = await Todo.find({ userId: currentUser._id }).sort('-createdAt');

   res.status(200).json({
      status: 200,
      data: { todos },
   });
};


/**
 * Deletes todo and registers to db.
 * @param req is a request object.
 * @param res is a response object.
 * @param next is the next middleware.
 */
let deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
   const body: RequestDeleteTodo = req.body;
   const currentUser: UserDoc = req.body.currentUser;

   // checking whether todo exists in db.
   const todo = await Todo.findById(body.todoId)

   if (!todo) {
      return next(new ApiError(404, 'Todo not found.')) 
   }

   if (!isMatching(todo.userId, currentUser._id)) {
      return next(new ApiError(401, 'Authorization Error')) 
   } 

   await todo.remove();

   res.status(200).json({
      status: 200,
      data: {
         message: 'Todo successfully deleted.',
      },
   });
}


/**
 * Updates todo and registers to db.
 * @param req is a request object.
 * @param res is a response object.
 * @param next is the next middleware.
 */
let updateTodo = async (req: Request, res: Response, next: NextFunction) => {
   const body: RequestUpdateTodo = req.body;
   const currentUser: UserDoc = req.body.currentUser;

   // checking whether todo exists in db.
   const todo = await Todo.findById(body.todoId)
   
   if (!todo) {
      return next(new ApiError(404, 'Todo not found.')) 
   }

   if (!isMatching(todo.userId, currentUser._id)) {
      return next(new ApiError(401, 'Authorization Error')) 
   } 

   todo.isDone = body.isDone;
   await todo.save();

   res.status(200).json({
      status: 200,
      data: { todo },
   });
}


// exporting methods
createTodo = catchAsync(createTodo);
updateTodo = catchAsync(updateTodo);
deleteTodo = catchAsync(deleteTodo);
retrieveTodos = catchAsync(retrieveTodos);
export { createTodo, updateTodo, deleteTodo, retrieveTodos };