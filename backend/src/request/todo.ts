   export interface RequestCreateTodo {
   content: string
} 

export interface RequestDeleteTodo {
   todoId: string
} 

export interface RequestUpdateTodo {
   todoId: string,
   isDone: boolean
} 