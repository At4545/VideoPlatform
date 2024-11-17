// there are 2-3 points of this code that i didnot understand .

class ApiError extends Error{
    constructor(
        statusCode,
        message="something Went Wrong",
        error=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message = message
        this.error =error
        
        if(stack){
            this.stack =stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
        
    }
}
export {ApiError}