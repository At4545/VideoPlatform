import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../modals/like.modal.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/ayncHandler.js"
import { Video } from "../modals/video.modal.js"
import {Comment} from "../modals/comment.modal.js"
import { Tweet } from "../modals/tweet.modal.js"
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(200, "inValid Object id")
    }
    const isVideoExist= await Video.findOne({_id:videoId})
    if(!isVideoExist){
        throw new ApiError(500,"Video doesnot exists ")        
    }
    const isExist= await Like.findOne({
        $and:{
            video: videoId,
            likedBy: req.user?._id
        }

    })

    if(isExist){
       const response =  await Like.findOneAndDelete({
            $and:{
                video: videoId,
                likedBy: req.user?._id
            }
        })

        if(!response){
            throw new ApiError(500,"something wrong with backend")
        }
        res.status(200).json(
            new ApiResponse(200,{},"Video disliked Successfully")
        )


    }

   else{
    const response = await Like.create({
        video:videoId,
        likedBy: req.user?._id
    })

    if(!response){
        throw new ApiError(500,"something wrong with backend")
    }
    res.status(200).json(
        new ApiResponse(200,response,"Video liked Successfully")
    )
    
   }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(200, "inValid Object id")
    }
    const isCommentExist= await Comment.findOne({_id:commentId})
    if(!isCommentExist){
        throw new ApiError(500,"Comment doesnot exists ")        
    }
    const isExist= await Like.findOne({
        $and:{
            comment: commentId,
            likedBy: req.user?._id
        }

    })

    if(isExist){
       const response =  await Like.findOneAndDelete({
            $and:{
                comment: commentId,
                likedBy: req.user?._id
            }
        })

        if(!response){
            throw new ApiError(500,"something wrong with backend")
        }
        res.status(200).json(
            new ApiResponse(200,{},"comment disliked Successfully")
        )


    }

   else{
    const response = await Like.create({
        comment:commentId,
        likedBy: req.user?._id
    })

    if(!response){
        throw new ApiError(500,"something wrong with backend")
    }
    res.status(200).json(
        new ApiResponse(200,response,"comment liked Successfully")
    )
    
   }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId)){
        throw new ApiError(200, "inValid Object id")
    }
    const isTweetExist= await Tweet.findOne({_id:tweetId})
    if(!isTweetExist){
        throw new ApiError(500,"tweet  doesnot exists ")        
    }
    const isExist= await Like.findOne({
        $and:{
            tweet: tweetId,
            likedBy: req.user?._id
        }

    })

    if(isExist){
       const response =  await Like.findOneAndDelete({
            $and:{
                tweet: tweetId,
                likedBy: req.user?._id
            }
        })

        if(!response){
            throw new ApiError(500,"something wrong with backend")
        }
        res.status(200).json(
            new ApiResponse(200,{},"tweet disliked Successfully")
        )


    }

   else{
    const response = await Like.create({
        tweet:tweetId,
        likedBy: req.user?._id
    })

    if(!response){
        throw new ApiError(500,"something wrong with backend")
    }
    res.status(200).json(
        new ApiResponse(200,response,"Video liked Successfully")
    )
    
   }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const response= await Like.aggregate([
        {
            $match:{ 
                $and:[
                    {comment:null|| undefined},
                   { tweet: null || undefined},
                   { likedBy:req.user?._id}
                ]
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"video",
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
        }
    ])
    if(!response){
        throw new ApiError(500," User have not has any liked videos")
    }
    res.status(200).json(
        new ApiResponse(200,response,"Liked videos Fetched")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}