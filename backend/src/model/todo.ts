import mongoose, { Schema } from 'mongoose';

// =====================
// Attributes
// =====================
interface TodoAttributes {
    isDone?: string;
    userId?: string;
    content?: string;
    createdAt?: string;
    updatedAt?: string;
}

// =====================
// User Model
// =====================
interface TodoModel extends mongoose.Model<TodoDoc> {
   build(attr: TodoAttributes): TodoDoc;
}

// =====================
// User Document
// =====================
export interface TodoDoc extends mongoose.Document {
   userId: string;
   isDone: boolean;
   content: string;
   createdAt: string;
   updatedAt: string;
}

// =====================
// Schema
// =====================
const TodoSchema = new Schema(
   {
      content: {
         type: String,
         required: [true, 'Please provide a todo content.'],
      },
      userId: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      isDone: {
         type: Boolean,
         default: false,
         required: true,
      },
   },
   {
      timestamps: true,
      versionKey: false,
   }
);

TodoSchema.statics.build = (attr: TodoAttributes) => {
    return new Todo(attr);
}

const Todo = mongoose.model<TodoDoc, TodoModel>('Todo', TodoSchema)
export default Todo