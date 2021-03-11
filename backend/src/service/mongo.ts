import keys from '../util/keys';
import mongoose from 'mongoose';

// ============================
// SETUP SCHEMAS
// ============================
import '../model/user';
import '../model/todo';

// ============================
// DATABASE CONNECTION
// ============================
mongoose
   .connect(keys.MONGO_HOST, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log('DB connection successful');
   })
   .catch(error => {
      console.error(error);
   });
