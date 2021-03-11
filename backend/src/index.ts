// config
import './service/mongo'

// imports
import cors from 'cors';
import express from 'express';
import keys from './util/keys';
import { globalErrorHandler } from './util/errorHandling';
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
import routesAuth from './routes/auth'
import routesTodo from './routes/todo'
app.use('/api/v1/auth', routesAuth)
app.use('/api/v1/todo', routesTodo)
app.use(globalErrorHandler)

// Exception catcher
process.on('uncaughtException', err => {
   console.log('UNCAUGHT EXCEPTION! 💥')
   console.log(err.name, err.message)
})

// Server Connection
const server = app.listen(keys.SERVER_PORT, () => {
   console.log(`Server running on Port ${keys.SERVER_PORT}`)
})

export { app, server }