import User from '../model/user'
import { ApiError } from '../util/ApiError'
import { retrieveJWTtoken } from '../util/util'
import { catchAsync } from '../util/errorHandling'
import { Request, Response, NextFunction } from 'express';


let authenticated = async (req: Request, res: Response, next: NextFunction) => {
   // getting the jwt token
   const token = retrieveJWTtoken(req)
      
   // checking whether the token exists in the header
   if (!token) {
      return next(new ApiError(401, 'You are not logged in! Please log in to get access.'))
   }
   
   // decoding the token
   const decodedTokenData = await User.decodeJWT(token);

   // Check if user still exists
   const currentUser = await User.findById(decodedTokenData.id)
   
   if (!currentUser) {
      return next(new ApiError(401, 'The user belonging to this token does no longer exist.'))
   }

   // setting founded user as current user.
   req.body.currentUser = currentUser
   next()
}

authenticated = catchAsync(authenticated)
export default authenticated