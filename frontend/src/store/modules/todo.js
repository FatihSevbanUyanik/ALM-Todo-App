/* eslint-disable no-unused-vars */
import { catchError } from '@/util/util.js'
import axios, { URL } from '@/util/AxiosConfig.js';

const state = {};
const getters = {};
const mutations = {};

const actions = {
   createTodo: catchError(async ({ commit, rootState }, payload) => { 
      const accessToken =  `Bearer ${rootState.auth.accessToken}`;
      const response = await axios.post(URL.TODO_CREATE, payload, { headers: { 'Authorization': accessToken }});
      return response.data.data.todo;
   }),
   retrieveTodos: catchError(async ({ commit, rootState }, payload) => { 
      const accessToken =  `Bearer ${rootState.auth.accessToken}`;
      const response = await axios.get(URL.TODO_RETRIEVE, { headers: { 'Authorization': accessToken }});
      return response.data.data.todos;
   }),
   updateTodo: catchError(async ({ commit, rootState }, payload) => { 
      const accessToken =  `Bearer ${rootState.auth.accessToken}`;
      const response = await axios.patch(URL.TODO_UPDATE, payload, { headers: { 'Authorization': accessToken }});
      return response.data.data;
   }),
   deleteTodo: catchError(async ({ commit, rootState }, payload) => { 
      const accessToken =  `Bearer ${rootState.auth.accessToken}`;
      const response = await axios.delete(URL.TODO_DELETE, { headers: { 'Authorization': accessToken }, data: payload });
      return response.data.data;
   }),
};

export default {
   state,
   mutations,
   actions,
   getters,
};
