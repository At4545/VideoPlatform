import mongoose from "mongoose"
import {Video} from "../modals/video.modal.js"
import {Subscription} from "../modals/subscription.modal.js"
import {Like} from "../modals/like.modal.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/ayncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    // views , totol video and likes --> video
    //totol subscriber

    const data= await Video.aggregate([
        {
            $match:{ owner: new mongoose.Types.ObjectId(req.user?._id)}
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"video",
                as:"likes"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"owner",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $addFields:{
                totalVideos: { $sum: 1},
                totolViews: { $sum:"$views"},
                totalLikes: {$sum : { $size:"$likes"}},
                totalSubscribers:{
                    $size:"$subscribers"
                }

            }
        },
        {
            $project:{
                totalVideos:1,
                totolViews:1,
                totalLikes:1,
                totalSubscribers:1
            }
        }
    ])

    if(!data){
        throw new ApiError(500,"data not fetched!")
    }
    res.status(200).json(
        new ApiResponse(200, data,"Dashboard data fetched successfully")
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const response = await Video.aggregate([
        {
            $match:{ owner: new mongoose.Types.ObjectId(req.user?._id)}
        },
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
    ])

    if(!response.length){
        throw new ApiError(500,"user has not uploaded any video")
    }
    res.status(200).json(
        new ApiResponse(200, response,"Channel Videos fetched successfully")
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }