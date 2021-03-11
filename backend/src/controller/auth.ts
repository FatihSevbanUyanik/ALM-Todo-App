// imports
import { ApiError } from '../util/ApiError';
import { catchAsync } from '../util/errorHandling';
import { Request, Response, NextFunction } from 'express';

// requests
import { RequestSignUp, RequestSignIn, RequestForgotPassword } from '../request/auth';

// model
import User from '../model/user' 

// methods

/**
 * Registers the user to the system.
 * @param req is a request object.
 * @param res is a response object.
 * @param next is the next middleware.
 */
let signUp = async (req: Request, res: Response, next: NextFunction) => {
   const body: RequestSignUp = req.body;
   const user = User.build(body);
   await user.save();

   res.status(200).json({
      status: 200,
      data: { 
         message: 'Signed up successfully.'    
      },
   });
};


/**
 * Enables the user to sign in.
 * @param req is a request object.
 * @param res is a response object.
 * @param next is the next middleware.
 */
let signIn = async (req: Request, res: Response, next: NextFunction) => {
   // parsing body
   const body: RequestSignIn = req.body

   // checking whether user exists in db.
   const user = await User.findOne({ 
      $or: [{email: body.usernameOrEmail}, 
            {username: body.usernameOrEmail}]
   }).select('+password')
   
   // check user existence
   if (!user) return next(new ApiError(404, 'User not found.')) 
   
   // checking whether the passwords match with each other. 
   const isPasswordCorrect = await User.correctPassword(body.password, user.password)
   if (!isPasswordCorrect) return next(new ApiError(401, 'Wrong Password'))

   // generating corrsponding JWT token
   const token = User.generateJWT({ id: user._id })
   user.password = undefined

   res.status(200).json({
      status: 200,
      data: { token, user } 
   })
}

/**
 * Updates the password
 * @param req is a request object.
 * @param res is a response object.
 * @param next is the next middleware.
 */
let forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
   // parsing body
   const body: RequestForgotPassword = req.body

   // checking whether user exists in db.
   const user = await User.findOne({ email: body.email})
                          .select('+password')
   
   // check user existence
   if (!user) return next(new ApiError(404, 'User not found.')) 

   // update new password
   user.password = body.password
   user.passwordConfirm = body.passwordConfirm
   await user.save()

   res.status(200).json({
      status: 200,
      data: { 
         message: 'Password updated successfully.'    
      },
   });
}

// exporting methods
signUp = catchAsync(signUp);
signIn = catchAsync(signIn);
forgotPassword = catchAsync(forgotPassword);
export { signUp, signIn, forgotPassword };