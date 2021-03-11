// imports
import { Router } from 'express'
const routerAuth = Router()

// methods
import { signUp, signIn, forgotPassword } from '../controller/auth'

// validations
import { validateSignUp, validateSignIn, validateForgotPassword } from '../validation/auth'


// routes
routerAuth.post('/signUp', validateSignUp, signUp)
routerAuth.post('/signIn', validateSignIn, signIn)
routerAuth.post('/forgot-password', validateForgotPassword, forgotPassword)

export default routerAuth