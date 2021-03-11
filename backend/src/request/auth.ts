export interface RequestSignUp {
   email: string,
   username: string,
   password: string,
   passwordConfirm: string
}

export interface RequestSignIn {
   password: string,
   usernameOrEmail: string,
}

export interface RequestForgotPassword {
   email: string,
   password: string,
   passwordConfirm: string,
} 