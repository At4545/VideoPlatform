import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../modals/comment.modal.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/ayncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
 
    const response = await Comment.aggregate([
       
        {
            $match:{
                video:new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $skip:Number( (page-1) * limit)
        },
        {
            $limit:  Number(limit)
        },
        
    ])
    if(!response){
        throw new ApiError(500,"videos comment didnot fetched")

    }
    res.status(200).json(
        new ApiResponse(200,response,"Videos comments are fetched successfully")
    )
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId}= req.params
    const {content}= req.body

    if(!isValidObjectId(videoId)){
        throw new ApiError(500,"object id is not valid")

    }

    if(!content || !content.trim()){
        throw new ApiError(500," Comment should not be empty! something went wrong")

    }

   const response =  await Comment.create({
        content:content,
        video:videoId,
        owner: req.user?._id
    })

    if(!response){
        throw new ApiError(500," Comment didnot uploaded! something went wrong")
    }
    res.status(200).json(
        new ApiResponse(200,response,"comment is created successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId}= req.params
    const {content}= req.body
    if(!isValidObjectId(commentId)){
        throw new ApiError(500,"object id is not valid")

    }

    if(!content || !content.trim()){
        throw new ApiError(500," Comment should not be empty!")

    }

    const response= await Comment.findOneAndUpdate({
        $and:[
           { _id:commentId},
            {owner:req.user?._id},

        ]
    },{
        content
    },{
        new:true
    })
    if(!response){
        throw new ApiError(500,"Comment not found or You are not authorize to made the changes")
    }
    res.status(200).json(
        new ApiResponse(200,response,"comment is updated successfully")
    )

    
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}= req.params
    console.log(commentId)
    if(!isValidObjectId(commentId)){
        throw new ApiError(500,"object id is not valid")

    }
    const response =await Comment.findOneAndDelete({
        $and:[
            { _id:commentId},
             {owner:req.user?._id},
 
         ]
    })
    if(!response){
        throw new ApiError(500,"Comment not found or You are not authorize to delelte  the comment")
    }
    res.status(200).json(
        new ApiResponse(200,{},"comment is deleted successfully")
    )
})



export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }