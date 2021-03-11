<template>
   <v-card
      outlined
      :class="`mb-4 px-4 py-3 elevation-1 ${todo.isDone ? 'border-grey' : 'border-primary'}`"
      :key="todo._id"
   >
      <v-row>
         <v-col class="col-md-4 col-6" align-self="center">
            <div class="caption font-weight-medium grey--text">Todo</div>
            <div :class="`text-subtitle-2 ${todo.isDone && 'text-decoration-line-through'}`">
               {{ todo.content }}
            </div>
         </v-col>

         <v-col class="col-md-4 col-6" align-self="center">
            <div class="caption font-weight-medium grey--text">Date</div>
            <div :class="`text-subtitle-2 ${todo.isDone && 'text-decoration-line-through'}`">
               {{ processDate(todo.createdAt) }}
            </div>
         </v-col>

         <v-col class="col-md-2 col-6" align-self="center">
            <div class="caption font-weight-medium grey--text">Is Done</div>

            <v-checkbox
               class="my-0"
               color="secondary"
               hide-details
               @change="updateTodo(todo)"
               v-model="todo.isDone"
            ></v-checkbox>
         </v-col>

         <v-col class="col-md-2 col-6" align-self="center">
            <div class="caption font-weight-medium grey--text">Delete</div>

            <v-btn
               @click="deleteTodo(todo)"
               :color="`${todo.isDone ? 'rgb(188, 195, 204)' : 'rgb(0, 102, 255)'}`"
               fab
               class="elevation-0"
               x-small
               dark
            >
               <v-icon>mdi-delete</v-icon>
            </v-btn>
         </v-col>
      </v-row>
   </v-card>
</template>

<script>
import { processDate } from '@/util/util'

export default {
   props: {
      todo: {
         type: Object,
      },
   },
   methods: {
      processDate,
      async updateTodo(todo) {
         try {
            const payload = { todoId: todo._id, isDone: todo.isDone };
            await this.$store.dispatch('updateTodo', payload);
            this.$toast.success(`Todo Updated`);
         } catch (exception) {
            todo.isDone = !todo.isDone;
            this.$toast.error(exception);
         }
      },
      async deleteTodo(todo) {
         try {
            const payload = { todoId: todo._id };
            await this.$store.dispatch('deleteTodo', payload);
            this.$emit('refreshTodos');
            this.$toast.success(`Todo Deleted`);
         } catch (exception) {
            this.$toast.error(exception);
         }
      },
   }
};
</script>
