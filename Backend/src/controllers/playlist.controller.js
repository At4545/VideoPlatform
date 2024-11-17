import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../modals/playlist.modal.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/ayncHandler.js"
 import { Video } from "../modals/video.modal.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!name?.trim() || !description?.trim()  ){
        throw new ApiError(500,"Both Name and Description is required")
    }
    
    const playlist = await Playlist.create({
        name,
        description,
        videos:[],
        owner: req.user?._id
    })
    if(!playlist){
        throw new ApiError(500,"server is not responding.playlist not Created")
    }
    res.status(200).json(
        new ApiResponse(200,"Your playlist is create")
    )

    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(500,"Enter valid UserId")
    }
    //TODO: get user playlists
    const playlists =  await Playlist.aggregate([
        {
            $match:{owner: new mongoose.Types.ObjectId(userId) }
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
                            userName:1,
                            fullName: 1,
                            avatar:1
                            
                        }
                    }
                ]
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"videos",
                foreignField:"_id",
                as:"videos",
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

    if(!playlists.length){
        throw new ApiError(500,"playlist does not exists for this user ")

    }
    res.status(200).json(
        new ApiResponse(200,playlists,"user's playlist successfully fetched!!")
    )

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!isValidObjectId(playlistId)){
        throw new ApiError(500,"Enter valid Playlist Id")
    }

    const playlist =  await Playlist.aggregate([
        {
            $match:{_id: new mongoose.Types.ObjectId(playlistId) }
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
                            userName:1,
                            fullName: 1,
                            avatar:1
                            
                        }
                    }
                ]
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"videos",
                foreignField:"_id",
                as:"videos",
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
        
    ])

    if(!playlist.length){
        throw new ApiError(500,"watch history does not exists")

    }
    res.status(200).json(
        new ApiResponse(200,playlist,"watch history successfully fetched!!")
    )

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(500,"Enter valid Playlist Id and videoId")
    }
    const isExist = await Video.exists({_id:videoId})
    if(!isExist){
        
        throw new ApiError(500,"Video doesnot exist")
    }

    const playlist= await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(500,"playlist not found")
    }
    //can check if video with videoID exist 
    if( playlist?.videos?.includes("66ba3f72d4c09f5ca6bf2080")){
        throw new ApiError(500,"allReady in  the playlist")

    }
    playlist.videos.push(videoId)
    const response = await playlist.save({ValiditeBeforeSave:true})

    if(!response){
        throw new ApiError(500,"Something went wrong at backend")
    }

    res.status(200).json(
        new ApiResponse(200,response,"video added to the playlist ")
    )



})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    
    if(!isValidObjectId(playlistId) && !isValidObjectId(videoId)){
        throw new ApiError(500,"Enter valid Playlist Id and videoId")
    }
    

    const playlist= await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(500,"playlist not found")
    }
    //can check if video with videoID exist 
    if(playlist?.owner != req.user?._id){
        throw new ApiError(500,"you are not the author so that you can't delete ")
    }

    if(!playlist.video?.length && !playlist.videos?.includes(videoId)){
        throw new ApiError(500,"This video not present in this playlist ")

    }

    const videosArray = playlist.videos.filter((id)=> id != videoId)
     
    console.log(videosArray)

    playlist.videos=videosArray

    const response = await playlist.save({ValiditeBeforeSave:true})

    if(!response){
        throw new ApiError(500,"Something went wrong at backend")
    }

    res.status(200).json(
        new ApiResponse(200,response,"video deleted from the playlist ")
    )


})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

     
    if(!isValidObjectId(playlistId) ){
        throw new ApiError(500,"Enter valid Playlist Id")
    }

    const response = await Playlist.findByIdAndDelete(playlistId)

    if(!response){
        throw new ApiError(500,"playlist either donot exist or already deleted")
    }
    res.status(200).json(
        new ApiResponse(200,{},"The Playlist Got deleted")
    )
    
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(500,"Enter valid Playlist Id and videoId")
    }
    
    if(!name?.trim() || !description?.trim()  ){
        throw new ApiError(500,"Both Name and Description is required")
    }


    const playlist= await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(500,"playlist not found")
    }

    playlist.name= name
    playlist.description= description
    
    const response = await playlist.save({ValiditeBeforeSave:true})

    if(!response){
        throw new ApiError(500,"Something went wrong at backend")
    }

    res.status(200).json(
        new ApiResponse(200,response,"video added to the playlist ")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}