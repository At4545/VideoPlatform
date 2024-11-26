import { asyncHandler } from "../utils/ayncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../modals/user.modal.js"
import {deleteFileOnCloudinary, uploadFileOnCloudinary} from "../utils/cloudnary.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { response } from "express";

const generateAccessAndRefreshToken= async(_id)=>{
    const user = await User.findById(_id)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforSave:false})
    return {accessToken,refreshToken}
}

//to register the user
const userRegister= asyncHandler(async(req,res)=>{
    const { fullName, userName , email ,password}= req.body


    if( 
        [fullName, userName , email ,password].some((feild)=> feild.trim() === "")){
        throw new ApiError(401, "fullName, userName , email ,password are required")
    }

   const existedUser= await User.findOne({
        $or: [{userName},{email}]
    })

    if(existedUser){
        throw new ApiError(402, "User Already existed")
    }

    const avatarLocalPath= req.files?.avatar[0]?.path
    //const coverImageLocalPath= req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


    if(!avatarLocalPath){
        throw new ApiError(403, "Avatar is mandatory")
    }
     
    const avatar=await uploadFileOnCloudinary(avatarLocalPath)//avatar.url that what we needs
    const coverImage=await uploadFileOnCloudinary(coverImageLocalPath)
    


    if(!avatar){
        throw new ApiError(400, "Avatar is not uploaded on the cloudinary")

    }

    const user = await User.create({
        fullName, 
        avatar: { 
                    id:avatar?.public_id,
                    url:avatar?.url
                },
        coverImage:{
                    id:coverImage?.public_id ,
                    url:coverImage?.url
                    },
        email,
        password,
        userName: userName.toLowerCase(),
    })

    const createdUser= await User.findById(user._id).select("-password -refreshToken")
   

    if(!createdUser){
        throw new ApiError(500, "Account not created")
    }

    return  res.status(201).json(
        new ApiResponse(202,createdUser,"Account Created Successfully!!")
    )

})

//to Login the user 
//1. req.body== for email || username || password
//2.validate email and username and password ---- it should not be empty
//3. find by user by emailid or username
//4. generate access token and refresh token
//5. save access token and refresh token in cookie

const userLogin = asyncHandler(async(req,res)=>{
    
    const {email, userName,password} = req.body
    // console.log(email,userName,password)
    if(!(email || userName)){
        throw new ApiError(401, "Email or Username is required!")
    }
    const user=await User.findOne({
        $or: [{email},{userName}]
    })
    if(!user){
        throw new ApiError(401, "Email or Username is wrong")   
    }
    const isCorrect= await user.isPasswordCorrect(password)

    if(isCorrect === false){
        throw new ApiError(401, "password is wrong")   
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true,
    }

    return res.status(201)
              .cookie("accessToken",accessToken,options)
              .cookie("refreshToken",refreshToken,options)
              .json(
                new ApiResponse(
                    200,
                    {user, accessToken,refreshToken},//we are sending refresh token and access token in case of phone where cookie cannot be stored
                    "user Logged In Successfully"
                )
              )

})
// to logout user:- 
//[1]we need to remove refreshToken from the database 
//[2]remove refresh and access token from cookie
const userLogout= async (req,res)=>{
    //since We have used verifyJWT from auth.middleware.js here// that is why we are getting req.user

    const user= req.user
    // console.log("user-->",user._id)
    const x=await User.findByIdAndUpdate(
        user._id,
        {
            $set: { refreshToken: '' }
        },
        {
            new: true
        }
    )
console.log("x-->",x)
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

}

//since we have refresh token present in the cookies or user could send through header (in case of mobile)
// we will decode that refresh token , get user id , make a db call, verify refresh token
// then we will create new access token 
const refreshAccessToken =asyncHandler(async(req,res)=>{
    const token = req.cookies?.refreshToken || req.body?.refreshToken

    if(!token){
        throw new ApiError(401,"Refresh Token expired!!")
    }

    const decodedToken= jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
    const user=await User.findById(decodedToken?._id)
    if(!user){
        throw new ApiError(401,"Refresh Token Invalid!!")
    }
    if(user.refreshToken !== token){
        throw new ApiError(401,"Refresh Token Invalid!!")

    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(decodedToken._id)
    if(!(accessToken && refreshAccessToken)){
        throw new ApiError(401,"something went wrong")
    }
    const options ={
        httpOnly: true,
        secure:true
    }
    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {accessToken,refreshToken:refreshToken},
            "refresh token refresh!")
    )
})
//get current old and new/confirm password ... {req.body}
//get user_id(how)-- by using the auth middleware
//make a db call 
// compare current password and hashed password
// save the current password (it will automatically hash the password),
// save in the db
const changeCurrentPassword=asyncHandler(async(req,res)=>{
   const {oldPassword, newPassword}= req.body
   const userID = req.user?._id

   if(!userID){
     throw new ApiError(500, "session expired!! please login again")
   }
   const user= await User.findById(userID)

   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

   if(!isPasswordCorrect){
    throw new ApiError(400, "Please check you old password")
   }
   user.password= newPassword
   const isPasswordSaved= await user.save({validateBeforSave:false})

   if(!isPasswordSaved){
    throw new ApiError(500, "password did not saved ! please try again later")
   }

   res.status(200).json(
    new ApiResponse(200,{},"password changed successfully")
   )


})

const getCurrentUser = asyncHandler(async(req, res) => { 
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails= asyncHandler(async(req,res)=>{
    const {email,fullName}=req.body

    if(!(email.trim() && fullName.trim())){
        throw new ApiError(400,"Both email And FullName is required")
    }

    const user= await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                email,
                fullName
            }
        },
        {
            new:true
        }
    ).select("-password -refreshToken")

    if(!user){
        throw new ApiError(400,"User detials donot saved")

    }
    res.status(200).json(
        new ApiResponse(200,user,"Account details updated successfully")
    )

})
// const updateUserAvatar= asyncHandler(async(req,res)=>{
//     const avatarFilePath = req.file?.path
//     if(!avatarFilePath){
//         throw new ApiError(300,"Local file not found ")
//     }

//     const avatar= await uploadFileOnCloudinary(avatarFilePath)

//     if(!avatar.url){
//         throw new ApiError(300,"file didnot upload on cloudnary")
//     }
//     const response=await User.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set:{ 
//                 avatar:avatar.url
//             }
//         },
//         {
//             new:true
//         }
//     ).select("-password -refreshToken")
    
//     res.status(200)
//        .json(
//         new ApiResponse(200,response,"Avatar image updated successfully")
//        )

// })
const updateUserAvatar= asyncHandler(async(req,res)=>{
    const avatarFilePath = req.file?.path
    if(!avatarFilePath){
        throw new ApiError(300,"Local file not found ")
    }

    const user= await User.findOne(req.user?._id)
    if(!user){
        throw new ApiError(500, "Invalid credentials||user not found")

    }
    //deleting the old file on cloudnary
    await deleteFileOnCloudinary(user.avatar.id)
    //uploading new file on cloudnary
    const avatar= await uploadFileOnCloudinary(avatarFilePath)
    if(!avatar){
        throw new ApiError(500, "File didnot upload on cloudinary")
    }
    user.avatar={
        id: avatar?.public_id,
        url: avatar?.url
    }
    const response=await user.save({validateBeforSave:false})
    if(!response){
        throw new ApiError(500, "Avatar not updated")
    }
    
    res.status(200).json(
        new ApiResponse(200,response,"avatar updated!")
    )

   
})
const updateUserCoverImage= asyncHandler(async(req,res)=>{
    const coverImageFilePath = req.file?.path
    if(!coverImageFilePath){
        throw new ApiError(300,"Local file not found ")
    }

    const user= await User.findOne(req.user?._id)
    if(!user){
        throw new ApiError(500, "Invalid credentials||user not found")

    }
    //deleting the old file on cloudnary
    await deleteFileOnCloudinary(user?.coverImage?.id)
    //uploading new file on cloudnary
    const coverImage= await uploadFileOnCloudinary(coverImageFilePath)
    if(!coverImage){
        throw new ApiError(500, "File didnot upload on cloudinary")
    }
    user.coverImage={
        id: coverImage?.public_id,
        url: coverImage?.url
    }
    const response=await user.save({validateBeforSave:false})
    if(!response){
        throw new ApiError(500, "Avatar not updated")
    }
    
    res.status(200).json(
        new ApiResponse(200,response,"avatar updated!")
    )
})
const getUserChannelProfile= asyncHandler(async(req,res)=>{

    const userName= req.params.userName

    
    if (!userName?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel= await User.aggregate([
        {
            $match:{userName:userName.toLowerCase()}
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers"
                },
                channelsSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond: { if:{ $in:[req.user?._id,"$subscribers.subscriber"]},
                             then:true,
                             else: false }
                }
            }
        },
        {
            $project:{
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])
    if(!channel?.length){
        throw new ApiError(500,"channel does not exists")
    }
    res.status(200).json(
        new ApiResponse(200,channel[0],"User channel fetched successfully")
    )

})

const getWatchHistory = asyncHandler(async(req, res) => {
    const user = User.aggregate([
        {
            $match: {
                _id:new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup:{
                from:"videos",//havenot made yet
                localField:"watchHistory",//this name to be matched with the video
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]

            }
        },
        {
            $project:{
                watchHistory:1
            }
        }
    ])
    if(!user.length){
        throw new ApiError(500,"watch history does not exists")
    }
    res.status(200).json(
        new ApiResponse(200,user[0],"watch history successfully fetched!!")
    )
})

// check if userName or email existed 
const validateEmailOrUserName=asyncHandler(async(req,res)=>{
    const id= req.params.id
    const isEmail =id?.includes("@")
    var response
    if(isEmail){
     response=await User.countDocuments({email:id})
    }
    else{
     response=await User.countDocuments({userName:id})
    }
    res.status(200).json(
        new ApiResponse(200,response,"validateEmailOrUsername")
    )
})
export {
    userRegister,
    userLogin,
    userLogout,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    validateEmailOrUserName
}