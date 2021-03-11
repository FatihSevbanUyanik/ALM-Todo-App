import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import keys from '../util/keys';
import { promisify } from 'util';
import mongoose, { Schema } from 'mongoose';

// =====================
// Attributes
// =====================
interface UserAttributes {
   email: string,
   username: string,
   password: string,
   passwordConfirm?: string,
}

interface JwtCredentials {
   id: string
}

// =====================
// User Model
// =====================
interface UserModel extends mongoose.Model<UserDoc> {
   build(attr: UserAttributes): UserDoc
   generateJWT(credentials: JwtCredentials): string;
   decodeJWT(token: string): Promise<JwtCredentials>
   correctPassword(candidate: string, encrypted: string | undefined): Promise<boolean>;
}

// =====================
// User Document
// =====================
export interface UserDoc extends mongoose.Document {
   email: string,
   username: string,
   createdAt: string,
   updatedAt: string,
   password?: string,
   passwordConfirm?: string,
}

// =====================
// Schema
// =====================
const UserSchema = new Schema({
   username: {
      type: String,
      unique: [true, 'Username needs to be unique'],
      required: [true, 'Username is missing'],
      trim: true
   },  
   email: {
      type: String,
      unique: [true, 'Email needs to be unique'], 
      required:  [true, 'Email is missing'],
   },
   password: {
      required:  [true, 'You should provide a password.'],
      type: String,
      trim: true,
      minlength: 10,
      select: false
   },
   passwordConfirm: {
      type: String,
      trim: true,
      required: [true, 'You should provide password twice.'],
      validate: {
         validator(value: string) { return value === this.password },
         message: 'Passwords do not match.'
      } 
   }
}, {timestamps: true, versionKey: false})

// =====================
// Hooks
// ===================== 
UserSchema.pre('save', async function(next) {
   // changing password
   if (!this.isModified('password')) {
      return next()
   }
   
   const password = this.get('password')
   const hashedPassword = await bcrypt.hash(password, 10)
   this.set('password', hashedPassword)
   this.set('passwordConfirm', undefined)
   next()
})

// checking whether the hashed password matches 
UserSchema.statics.correctPassword = async (candidate: string, encrypted: string) => {
   return await bcrypt.compare(candidate, encrypted)
}

// generates JWT
UserSchema.statics.generateJWT = (credentials: JwtCredentials) => {
   return jwt.sign(credentials, keys.JWT_SECRET, { expiresIn: keys.JWT_EXPIRES_IN })
}

// decodes JWT
UserSchema.statics.decodeJWT = async (token: string) => {
   return await promisify<string, string>(jwt.verify)(token, keys.JWT_SECRET)
}

UserSchema.statics.build = (attr: UserAttributes) => {
   return new User(attr);
}

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema)
export default User