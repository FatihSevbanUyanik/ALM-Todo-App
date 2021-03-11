import { ApiError } from '../util/ApiError';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const extractValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
   const validationErrors = validationResult(req).array().map(item => item.msg);
   if (validationErrors.length) return next(new ApiError(400, validationErrors));
   next();
}
 
const retrieveJWTtoken = (req: Request) => {
   let token: string | undefined = undefined;
   
   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
   }

   return token 
}

const isMatching = (obj1: Object, obj2: Object) => {
   return obj1.toString() === obj2.toString()
} 


export {
   extractValidationErrors,
   retrieveJWTtoken,
   isMatching
}