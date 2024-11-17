// There are two type of format we use to create this async ka await wrapper

//1.
// This is preferable as its easy to write .
const asyncHandler =(fn)=>{
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next))
        .catch((error)=>{next(error)})
    }
}

export {asyncHandler}

//2.
//const asyncHandler= ()=>{ return ()=>{} }
    /*
const asyncHandler= (fn)=> async(req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (error) {
        console.log(error)
    }
}
    */