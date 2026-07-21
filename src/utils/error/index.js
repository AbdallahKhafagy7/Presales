export class AppError extends Error{
    constructor(message  , statusCode , errorDetails){
        super(message);
    }
}
export class ConflictError extends AppError{
    constructor( message , errorDetails){
         super(message,409,errorDetails);
    }
}
export class AuthorityError extends AppError{
    constructor( message , errorDetails){
         super(message,401,errorDetails);
    }
}
export class BadRequestError extends AppError{
    constructor( message , errorDetails){
         super(message,400,errorDetails);
    }
}
export class NotFoundError extends AppError{
    constructor( message , errorDetails){
         super(message,404,errorDetails);
    }
}