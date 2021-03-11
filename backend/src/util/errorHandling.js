const { ApiError } = require('./ApiError');

const catchAsync = func => {
   return (req, res, next) => func(req, res, next).catch(next)
}

const handleCastErrorDB = err => {
   const message = `Invalid ${err.path}: ${err.value}.`
   return new ApiError(400, message)
}
 
const handleDuplicateFieldsDB = err => {
   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
   const message = `Duplicate field value: ${value}. Please use another value!`
   return new ApiError(400, message)
}
 
const handleValidationErrorDB = err => {
   const messages = Object.values(err.errors).map(el => el.message)
   return new ApiError(400, messages)
}
 
const handleJWTError = () => {
   const message = 'Invalid token. Please log in again!'
   return new ApiError(401, message)
}
 
const handleJWTExpiredError = () => {
   const message = 'Your token has expired! Please log in again.'
   return new ApiError(message, 401)
}

const handleUnexpectedError = () => {
   const message = 'Something went very wrong!'
   return new ApiError(message, 500)
}

const globalErrorHandler = (err, req, res, next) => { 
   err.status = err.status || 'error'
   err.statusCode = err.statusCode || 500
   
   if (err.name === 'CastError') { 
      err = handleCastErrorDB(err)
   } else if (err.code === 11000) {
      err = handleDuplicateFieldsDB(err)
   } else if (err.name === 'ValidationError') { 
      err = handleValidationErrorDB(err)
   } else if (err.name === 'JsonWebTokenError') {
      err = handleJWTError()
   } else if (err.name === 'TokenExpiredError') {
      err = handleJWTExpiredError()
   } else if (!err.isOperational) {
      console.log(err)
      err = handleUnexpectedError()
   }

   res.status(err.status).json({
      status: err.status,
      errors: err.errorMessages,
   })
}

module.exports = {
   catchAsync,
   globalErrorHandler
}