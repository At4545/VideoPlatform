import axios from "axios"
class Video{


getAllVideos = async ()=>{
    try {
        const videos= await axios.get("/api/v1/video")
        if(videos){
            return videos
        }
        else{
            throw "something went worng"
        }
    } catch (error) {
        console.log("Videos-->getallvidoes--error->,",error)
    }
}
publishVideo= async({title,discription, videoFile,thumbnail})=>{

    try {
        const video=await axios.post("/api/v1/video/",{title,discription, videoFile,thumbnail})
        if(video){
            return video
        }
        else{
            throw 'something went wrong'
        }
       
    } catch (error) {
        console.log("Api's-->video-->publishVidoes",error)
    }

}

getVideoById = async({id})=>{
    try {
        const video = await axios.get(`/api/v1/video/${id}`)
        if(video){
            return video
        }
        else{
            throw "something went wrong"
        }
    } catch (error) {
        console.log("Api's-->video-->getVideoById",error)

    }
}

updateVideo = async({id,title,description,thumbnail=null})=>{
    try {
        const updatedVideo = await axios.patch(`/api/v1/video/${id}`,{title,description,thumbnail})
        if(updatedVideo){
            return updatedVideo
        }
        else{
            throw "something went wrong"
        }
    } catch (error) {
        console.log("Api's-->video-->updateVideo-->",error)
    }
}
deleteVideo= async({id})=>{
    try {
        return await axios.delete(`/api/v1/video/${id}`)
    } catch (error) {
        console.log("Api's-->video-->deleteVideo-->",error)
    }
}

togglePublish =async()=>{
    try {
       return await axios.patch("/api/v1/video/toggle/publish/")
    } catch (error) {
        console.log("Api's-->video-->togglePublish-->",error)

    }
}

}

const VideoService= new Video()

export default VideoService