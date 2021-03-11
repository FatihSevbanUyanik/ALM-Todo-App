<template>
   
         <form @submit.prevent="createTodo">
            <v-card outlined class="py-2 elevation-1 border-primary mt-7">
               <v-toolbar class="elevation-0">
                  <v-text-field
                     v-model="content"
                     label="Todo"
                     @blur="$v.content.$touch()"
                     :error-messages="contentErrors"
                     class="mr-3 mt-4"
                  ></v-text-field>
                  <v-btn x-small fab class="elevation-0" color="primary" type="submit" dark>
                     <v-icon>mdi-send</v-icon>
                  </v-btn>
               </v-toolbar>
            </v-card>
         </form>

</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
   data() {
      return {
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
      async createTodo() {
         this.$v.$touch();
         if (this.$v.$anyError) return;

         try {
            const { content } = this;
            const todo = await this.$store.dispatch('createTodo', { content });

            this.content = '';
            this.$v.content.$reset();
            this.$emit('addTodo', todo);
            this.$toast.success(`Todo created`);
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
