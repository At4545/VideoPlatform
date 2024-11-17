import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../modals/video.modal.js"
import {User} from "../modals/user.modal.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/ayncHandler.js"
import fs from "fs"
import {uploadFileOnCloudinary, deleteFileOnCloudinary } from "../utils/cloudnary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const response = await Comment.aggregate([
       
        {
            $search: {
                index: 'default', // Specify the name of your search index
                text: {
                  query: query,
                  path: ['title', 'description'], // Fields to search in
                  fuzzy: { maxEdits: 3 } // Optional: Allows for fuzzy search
                }
            }
        },
        
        {
            $skip:Number( (page-1) * limit)
        },
        {
            $limit:  Number(limit)
        },
        
    ])
})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    const { title, description} = req.body
    if(!(title && description) ){
        throw new ApiError(400,"Title or Description is missing. Both are required")
    }
    if(!req.user?._id){
        throw new ApiError(400,"You are authorized to upload videos")

    }

    let videoFilepath
    let thumbnailFilepath
    if (req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0) {
        videoFilepath = req.files.videoFile[0].path
    }
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailFilepath = req.files.thumbnail[0].path
    }
    // const videoFilepath= req.files?.videoFile[0]?.path
    // const thumbnailFilepath= req.files?.thumbnail[0]?.path
    if(!(videoFilepath && thumbnailFilepath)){
        videoFilepath && fs.unlinkSync(videoFilepath)
        thumbnailFilepath && fs.unlinkSync(thumbnailFilepath)
        throw new ApiError(400,"video or thumbnail is missing. Both are required")
        
    }
    

    const video = await uploadFileOnCloudinary(videoFilepath)
    const thumbnail = await uploadFileOnCloudinary(thumbnailFilepath)

    if(!video && !thumbnail){
        
        throw new ApiError(400,"video or thumbnail is not uploaded on cloudnary please try again . Both are required")
    }

    const response = await Video.create({
        videoFile: {
            id:video?.public_id,
            url:video?.url
        },
        thumbnail: {
            id:thumbnail?.public_id,
            url:thumbnail?.url
        },
        title,
        description,
        duration:video.duration,//need to check
        owner: req.user._id
    })
    if(!response){
        deleteFileOnCloudinary(video.public_id,true)
        deleteFileOnCloudinary(thumbnail.public_id)
        throw new ApiError(400,"backend error! data not saved on the backend")
    }

    res.status(200).json(
        new ApiResponse(200,response,"video uploaded successfully")
    )

    
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Enter a video object id ")
    }

    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"Video not found")
    }

    res.status(200).json(
        new ApiResponse(200, video, "video fetched successfully")
    )
    
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title,description}= req.body 
    const thumbnailLocalPath=  req.file?.path

    //TODO: update video details like title, description, thumbnail

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Enter a valid video id ")
    }
    if(!(title || description||thumbnailLocalPath)){
        throw new ApiError(400,"Need atleat one value to update ")
    }
    

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(400,"Video havenot Found ")
    }

    if(thumbnailLocalPath){
        const thumbnail= await uploadFileOnCloudinary(thumbnailLocalPath)
        if(!thumbnail){
            throw new ApiError(400,"thumbnail donot  upload on cloudinary ")
        }
        await deleteFileOnCloudinary(video.thumbnail?.id || "")
        video.thumbnail={
            id:thumbnail.public_id,
            url:thumbnail.url
        }
    }

    if(title?.trim()){
        video.title= title
    }
    if(description?.trim()){
        video.description= description
    }
    const finalResponse =await video.save({validateBeforSave:false})

    if(!finalResponse){
        throw new ApiError(400,"data not saved")
    }
    res.status(200).json(
        new ApiResponse(200,finalResponse,"updates are made successfully")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Enter a valid video id ")
    }

    const video= await Video.findById(videoId)
    
    if(!video){
        throw new ApiError(400,"Video not found")
    }
    
    await deleteFileOnCloudinary(video.thumbnail?.id)
    await deleteFileOnCloudinary(video.videoFile?.id,true)
    const response= await Video.findByIdAndDelete(videoId)
    if(!response){
        throw new ApiError(400,"video not present or already deleted")
    }
    res.status(200).json(
        new ApiResponse(200,{},"video Deleted Successfully")
    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Enter a valid video id ")
    }

    const video=await Video.findById(videoId)

    if(!video){
        throw new ApiError(400,"Video Not found ")
    }

    video.isPublished= !video.isPublished

    const response = await video.save({validateBeforSave:false})
    if(!response){
        throw new ApiError(400,"something went wrong")
    }
    res.status(200).json(
        new ApiResponse(
            200,
            response,
            "Changes are updated"
        )
    )

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}