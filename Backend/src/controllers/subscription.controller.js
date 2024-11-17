import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../modals/user.modal.js"
import { Subscription } from "../modals/subscription.modal.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/ayncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId) && !channelId.trim() ){
        throw new ApiError(300,"channel id is not valid")

    }
    // TODO: toggle subscription
    
    const isSubscribed =await Subscription.findOneAndDelete({
        $and:[{subscriber:new mongoose.Types.ObjectId(req.user?.id)},{channel:new mongoose.Types.ObjectId(channelId)}]
    })
    // if isSubscribed is not  present then create a new 
    // if not present then create it
    if(!isSubscribed){
        const user = await Subscription.create({
            subscriber:req.user?._id,
            channel:channelId
        })
        if(!user){
            throw new ApiError(500,"channel not Subscribed")
        }

        res.status(200).json(
            new ApiResponse(200,user,"channel Subcribed Successfully")
        )
    }

    res.status(200).json(
        new ApiResponse(200,isSubscribed,"channel unSubcribed Successfully")
    )
   
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(300,"object id is not valid")

    }
    const SubscriberList=await Subscription.aggregate([
        {
            $match:{channel: new mongoose.Types.ObjectId(channelId)}
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscriber",
                pipeline:[
                    {
                        $project:{
                            userName:1,
                            Fullname:1,
                            avatar:1
                        }
                    }
                ]
            }
        }
    ])
    if(!SubscriberList){
        throw new ApiError(400,"channel id donot exist")
    }
    res.status(200).json(
        new ApiResponse(200,SubscriberList,"Subscriber list Fetched successfully")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(300,"object id is not valid")

    }
    const SubscribedList=await Subscription.aggregate([
        {
            $match:{subscriber:new mongoose.Types.ObjectId(subscriberId)}
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"channel",
                pipeline:[
                    {
                        $project:{
                            userName:1,
                            Fullname:1,
                            avatar:1
                        }
                    }
                ]
            }
        }
    ])
    if(!SubscribedList){
        throw new ApiError(400,"channel id donot exist")
    }
    res.status(200).json(
        new ApiResponse(200,SubscribedList,"Subscriber list Fetched successfully")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}