export class ApiError extends Error {
   // props
   public status: number;
   public isOperational: boolean;
   public errorMessages: string[];

   // constructor
   constructor(status: number, errorMessages: string[] | string = []) {
      if (typeof errorMessages === 'string') {
         super(errorMessages);
         this.errorMessages = [errorMessages];
      } else {
         super(errorMessages[0]);
         this.errorMessages = errorMessages;
      }      

      this.status = status;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
   }
}