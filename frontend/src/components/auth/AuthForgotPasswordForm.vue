<template>
   <form @submit.prevent="resetPassword" class="mx-2">
      <div class="font-weight-bold headline">Forgot Password</div>
      <div class="caption grey--text lighten-1--text">Please provide your email and a new password.</div>

      <v-text-field
         @blur="$v.email.$touch()"
         :error-messages="mailErrors"
         v-model="email"
         label="Email"
         class="mt-2"
      ></v-text-field>

      <v-text-field
         @blur="$v.password.$touch()"
         :error-messages="passwordErrors"
         v-model="password"
         label="Password"
         class="mt-2"
         type="password"
      ></v-text-field>

      <v-text-field
         @blur="$v.passwordConfirm.$touch()"
         :error-messages="passwordConfirmErrors"
         v-model="passwordConfirm"
         label="Password Confirm"
         type="password"
         class="mt-2"
      ></v-text-field>

      <v-btn class="font-weight-bold primary px-10 mt-2" width="100%" type="submit">Reset Password</v-btn>
   </form>
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';

export default {
   data() {
      return {
         email: '',
         password: '',
         passwordConfirm: '',
      };
   },
   validations: {
      email: {
         required,
         email,
      },
      password: {
         required,
         minLength: minLength(10),
      },
      passwordConfirm: {
         required,
         minLength: minLength(10),
         sameAsPassword: sameAs('password'),
      },
   },
   computed: {
      mailErrors() {
         const errors = [];
         if (!this.$v.email.$dirty) return errors;
         !this.$v.email.required && errors.push('Email required');
         !this.$v.email.email && errors.push('Email invalid');
         return errors;
      },
      passwordErrors() {
         const errors = [];
         if (!this.$v.password.$dirty) return errors;
         !this.$v.password.required && errors.push('Password required');
         !this.$v.password.minLength && errors.push('Password needs to be at least 10 characters.');
         return errors;
      },
      passwordConfirmErrors() {
         const errors = [];
         if (!this.$v.passwordConfirm.$dirty) return errors;
         !this.$v.passwordConfirm.required && errors.push('Password required');
         !this.$v.passwordConfirm.minLength && errors.push('Password needs to be at least 10 characters.');
         !this.$v.passwordConfirm.sameAsPassword && errors.push('Passwords do not match each other.');
         return errors;
      },
   },
   methods: {
      async resetPassword() {
         this.$v.$touch();
         if (this.$v.$anyError) return;

         try {
            const { email, password, passwordConfirm } = this;
            const payload = { email, password, passwordConfirm };
            await this.$store.dispatch('forgotPassword', payload);
            this.$toast.success('Password successfully resetted.');
            this.$router.push({ name: 'auth.signIn' });
         } 
         catch (exception) {
            this.$toast.error(exception);
         }
      },
   },
};
</script>
