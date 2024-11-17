import { asyncHandler } from "../utils/ayncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../modals/user.modal.js"
export const verifyJWT =  asyncHandler( async(req,_, next)=>{

    const token= await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if(!token){
        throw new ApiError(400,"access token not found")
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
     if(!decode){
        throw new ApiError(400,"invalid access Token")

     }
    const user = await User.findById(decode._id).select("-password -refreshToken")
    if(!user){
        throw new ApiError(400,"invalid access Token")
    }
    req.user= user
    next()
 
 }
)