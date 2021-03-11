import { body } from 'express-validator';
import { extractValidationErrors } from '../util/util'

const validateSignUp = [
   body('email')
      .isEmail()
      .withMessage('Please provide an Email'),
   
   body('username')
      .notEmpty()
      .withMessage('Please provide a Username'),
   
   body('password')
      .isLength({ min: 8 })
      .withMessage('Password should be minimum 8 characters Long.'),
  
   body('passwordConfirm')
      .notEmpty()
      .withMessage('Password Confirmation is required.')
      .custom((value: string, { req }) => value === req.body.password)
      .withMessage('Passwords do not match.'),
   
   extractValidationErrors   
]

const validateSignIn = [
   body('usernameOrEmail')
      .notEmpty()
      .withMessage('Please provide your username or email'),
   
   body('password')
      .isLength({ min: 8 })
      .withMessage('Password should be minimum 8 characters Long.'),
   
   extractValidationErrors   
]

const validateForgotPassword = [
   body('email')
      .isEmail()
      .withMessage('Please provide your email'),
      
   body('password')
      .isLength({ min: 8 })
      .withMessage('Password should be minimum 8 characters Long.'),
   
   body('passwordConfirm')
      .notEmpty()
      .withMessage('Password Confirmation is required.')
      .custom((value: string, { req }) => value === req.body.password)
      .withMessage('Passwords do not match.'),
   
   extractValidationErrors   
]

export {
   validateSignIn,
   validateSignUp,
   validateForgotPassword
}