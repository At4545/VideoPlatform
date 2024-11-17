import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../modals/tweet.modal.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/ayncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}= req.body

    if(!content?.trim()){
        throw new ApiError(500,"Type something in the content")
    }
    
    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    })
    if(!tweet){
        throw new ApiError(500,"server is not responding")
    }
    res.status(200).json(
        new ApiResponse(200,tweet,"Your Tweet is posted")
    )

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const tweets = await  Tweet.aggregate([
        {
            $match:{owner : new mongoose.Types.ObjectId(req.user?._id)}
        }
    ])
    if(!tweets){
        throw new ApiError(500,"server is not responding")
    }

    res.status(200).json(
        new ApiResponse(200,tweets,"tweets fetched successfully")
    )
   
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {id} = req.params
    const {updatedContent} = req.body
    if(!isValidObjectId(id)){
        throw new ApiError(500,"Enter valid object id")
    }
    if(!updatedContent?.trim()){
        throw new ApiError(500,"Content can't be blank")
    }
    const tweet = await Tweet.findById(id)

    if(!tweet){
        throw new ApiError(500,"Tweet not Found")
    }

    tweet.content= updatedContent

    const finalTweet= await tweet.save({validateBeforeSave:false})
    if(!finalTweet){
        throw new ApiError(500,"something went wrong!..Tweet not upated")
    }
    
    res.status(200).json(
        new ApiResponse(200,finalTweet,"tweel got updated")
    )


})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {id} = req.params
    if(!isValidObjectId(id)){
        throw new ApiError(500, "Enter valid object id")
    }

    const response = await Tweet.findByIdAndDelete(id)
    if(!response){
        throw new ApiError(500, "somwthing went wrong ...could not find tweet")
    }

    res.status(200).json(
        new ApiResponse(200,{},"tweet got deleted!!")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}