import {useState,useEffect} from 'react'
import {VideoCard} from "../index.js"
import VideoService from "../../Apis/Videos.jsx"
import { clearAllListeners } from '@reduxjs/toolkit'

//check for lazy loading 

function Home() {
const [videos, setvideos] = useState([])

useEffect(() => {
  VideoService.getAllVideos().
  then((res)=>{
    setvideos(res.data.data)
    
  })
  .catch((err)=>{
    console.log(err)
  })
}, [])

  
console.log(videos)

  return (
    <div className='pt-14'>
        <div className='grid lg:grid-cols-4 place-items-center gap-3 overflow-hidden md:grid-cols-2  sm:grid-cols-1'>
        <VideoCard></VideoCard>
        <VideoCard></VideoCard>
        {
          videos.map((video)=>(
            <VideoCard key={video._id} video={video}></VideoCard>
          ))
        }
         <VideoCard></VideoCard>
         <VideoCard></VideoCard>
         <VideoCard></VideoCard>
         <VideoCard></VideoCard>
         <VideoCard></VideoCard>
         <VideoCard></VideoCard>
         <VideoCard></VideoCard>
         <VideoCard></VideoCard>
        </div>

    
   
    </div>
  )
}

export default Home