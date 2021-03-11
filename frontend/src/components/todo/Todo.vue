<template>
   <v-container class="mx-auto px-4">
      <v-row>
      <v-col class="col-md-8 offset-md-2">
               <todo-create @addTodo='todos.unshift($event)'></todo-create>

         
         </v-col></v-row>
      <v-row>
         <v-col class="col-md-8 offset-md-2">
            <v-divider></v-divider> </v-col
      ></v-row>
      <v-row>
         <v-col class="col-md-8 offset-md-2">
            <todo-item v-for="todo in todos" :key="todo._id" :todo="todo" @refreshTodos="retrieveTodos"></todo-item>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import TodoItem from '@/components/todo/TodoItem.vue'
import TodoCreate from '@/components/todo/TodoCreate.vue'

export default {
   components: { TodoCreate, TodoItem },
   async mounted() {
      await this.retrieveTodos();
   },
   data() {
      return {
         todos: [],
         content: '',
      };
   },
   validations: {
      content: { required },
   },
   computed: {
      contentErrors() {
         const errors = [];
         if (!this.$v.content.$dirty) return errors;
         !this.$v.content.required && errors.push('Todo content required');
         return errors;
      },
   },
   methods: {
      
      async retrieveTodos() {
         try {
            this.todos = await this.$store.dispatch('retrieveTodos');
         } catch (exception) {
            this.$toast.error(exception);
         }
      },
      
   },
};
</script>

<style scoped>
.border-primary {
   border-left: 5px solid rgb(0, 102, 255);
}

.border-grey {
   border-left: 5px solid rgb(188, 195, 204);
}
</style>
