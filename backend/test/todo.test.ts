import request from 'supertest'
import mongoose from 'mongoose'
import User from '../src/model/user' 
import Todo from '../src/model/todo' 
import { app, server } from '../src/index'

let token = ''
const password = 'naruto1212'

let user = User.build({ 
   email: 'userTemp@gmail.com', 
   passwordConfirm: password, 
   username: 'userTemp', 
   password 
}) 

beforeAll(async () => {
   user = await user.save()
   token = `Bearer ${ User.generateJWT({ id: user._id }) }` 
})

afterAll(async () => {
   await user.delete()
   mongoose.connection.close()
   server.close()
})


test('POST:/api/todo', async () => {
   // request data
   const data = [
      { body: {}, expectedStatus: 400 }, // empty body
      { body: { content: `` }, expectedStatus: 400 }, // empty content
      { body: { content: `lorem ipsum content` }, expectedStatus: 200 }, // success
   ]

   // sending requests
   const todoIds:string[] = []

   for (const requestItem of data) {
      const { body } = await request(app)
         .post('/api/v1/todo')
         .set('Authorization', token)
         .set('Accept', 'application/json')
         .send(requestItem.body)
         .expect('Content-Type', /json/)
         .expect(requestItem.expectedStatus)     
      
      if (requestItem.expectedStatus >= 400) continue
      todoIds.push(body.data.todo._id)
   }

   // cleaning
   await Todo.deleteMany({ _id: { $in: todoIds } })
});


test('PATCH:/api/todo', async () => {
   // registering todo
   const todo = Todo.build({ content: "my content", userId: user._id })
   await todo.save()

   // request data
   const data = [
      { body: { isDone: true }, expectedStatus: 400 }, // todo missing
      { body: { todoId: todo._id }, expectedStatus: 400 }, // isDone missing
      { body: { todoId: 'random', isDone: true }, expectedStatus: 400 }, // wrong todo 
      { body: { todoId: todo._id, isDone: true }, expectedStatus: 200 }, // success
      { body: { todoId: todo._id, isDone: false }, expectedStatus: 200 }, // success
   ]

   // sending requests
   for (const requestItem of data) {
      await request(app)
         .patch('/api/v1/todo')
         .set('Authorization', token)
         .set('Accept', 'application/json')
         .send(requestItem.body)
         .expect('Content-Type', /json/)
         .expect(requestItem.expectedStatus)     
   }

   // cleaning
   await todo.remove()
});


test('DELETE:/api/todo', async () => {
   // registering todo
   const todo = Todo.build({ content: "my content", userId: user._id })
   await todo.save()

   // request data
   const data = [
      { body: {}, expectedStatus: 400 }, // todo missing 
      { body: { todoId: 'random' }, expectedStatus: 400 }, // wrong todo 
      { body: { todoId: todo._id }, expectedStatus: 200 }, // success
   ]
   
   // sending requests
   for (const requestItem of data) {
      await request(app)
         .delete('/api/v1/todo')
         .set('Authorization', token)
         .set('Accept', 'application/json')
         .send(requestItem.body)
         .expect('Content-Type', /json/)
         .expect(requestItem.expectedStatus)
   }

   await todo.remove()
});


test('GET:/api/todo', async () => {
   // registering todo
   const todo = Todo.build({ content: "my content", userId: user._id })
   await todo.save()

   // sending request
   await request(app)
      .get('/api/v1/todo')
      .set('Authorization', token)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

   await todo.remove()
});
