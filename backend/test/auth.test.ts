import { app, server } from '../src/index'
import request from 'supertest'
import mongoose from 'mongoose'
import User from '../src/model/user' 


afterAll(async () => {
   mongoose.connection.close()
   server.close()
})


const sendRequest = async (requestItem, url: string) => {
   await request(app)
      .post(url)
      .send(requestItem.body)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(requestItem.expectedStatus)     
} 


test('POST:/api/auth/signUp', async () => {
   // request data
   const data = [
      { body: { email: `user1@gmail.com`, username: `user1`, password: `naruto1212`, passwordConfirm: `naruto1212` }, expectedStatus: 200 }, // success
      { body: { email: `user2@gmail.com`, username: `user1`, password: `naruto1212`, passwordConfirm: `naruto1212` }, expectedStatus: 400 }, // duplicate username
      { body: { email: `user2@gmail.com`, username: `user2`, password: `nar`, passwordConfirm: `nar` }, expectedStatus: 400 }, // short password
      { body: { email: `user2@gmail.com`, password: `naruto1212`, passwordConfirm: `naruto1212` }, expectedStatus: 400 }, // lack of username
      { body: { email: `user2@gmail.com`, username: `user2`, password: `naruto1997`, passwordConfirm: `naruto1212` }, expectedStatus: 400 }, // password mismatch
      { body: { email: `user2@gmail.com`, username: `user2`, password: `naruto1212`, passwordConfirm: `naruto1212` }, expectedStatus: 200 }, // success
   ]

   // sending requests
   const userEmails: string[] = []
   for (const requestItem of data) {
      await sendRequest(requestItem, '/api/v1/auth/signUp')
      if (requestItem.expectedStatus >= 400) continue
      userEmails.push(requestItem.body.email)
   }

   // cleaning
   await User.deleteMany({ email: { $in: userEmails } })
});


test('POST:/api/auth/signIn', async () => {
   // registering user
   const password = 'naruto1212'
   let user = User.build({ email: 'user3@gmail.com', username: 'user3', password, passwordConfirm: password }) 
   user = await user.save()

   // request data
   const data = [
      { body: { usernameOrEmail: user.username }, expectedStatus: 400 }, // password missing
      { body: { password:`extra${password}` }, expectedStatus: 400 }, // username or email missing
      { body: { usernameOrEmail: user.email,  password }, expectedStatus: 200 }, // success email
      { body: { usernameOrEmail: user.username,  password }, expectedStatus: 200 }, // sucess username
      { body: { usernameOrEmail: `extra${user.email}`, password }, expectedStatus: 404 }, // wrong email
      { body: { usernameOrEmail: `extra${user.username}`, password }, expectedStatus: 404 }, // wrong username
      { body: { usernameOrEmail: user.email, password:  `extra${password}` }, expectedStatus: 401 }, // wrong password
      { body: { usernameOrEmail: user.username, password:`extra${password}` }, expectedStatus: 401 }, // wrong password
   ]

   // sending requests
   for (const requestItem of data) {
      await sendRequest(requestItem, '/api/v1/auth/signIn')
   }

   // cleaning
   await user.remove()
});


test('POST:/api/auth/forgot-password', async () => {
   // registering user
   let user = User.build({ email: 'user4@gmail.com', username: 'user4', password: 'naruto1212', passwordConfirm: 'naruto1212' }) 
   user = await user.save()

   // request data
   const data = [
      { body: { email: `extra${user.email}`, password: `narutoUpdated`, passwordConfirm: `narutoUpdated` }, expectedStatus: 404 }, // wrong email
      { body: { email: user.email, password: `narutoUpdated`, passwordConfirm: `narutoUpdated` }, expectedStatus: 200 }, // success
      { body: { email: user.email, password: `narutoUpdated`, passwordConfirm: `naruto1212`}, expectedStatus: 400 }, // password mismatch
      { body: { password: `narutoUpdated`, passwordConfirm: `naruto1212`}, expectedStatus: 400 }, // email missing
      { body: { email: user.email, password: `narutoUpdated` }, expectedStatus: 400 }, // no password conifmation
   ]
   
   // sending requests
   for (const requestItem of data) {
      await sendRequest(requestItem, '/api/v1/auth/forgot-password')   
   }

   await user.remove()
});
