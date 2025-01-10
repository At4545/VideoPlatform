import React,{useEffect,useState} from 'react'
import VideoService from '../../Apis/Videos'
import { useParams} from 'react-router-dom'

//create at 
//titile 
//description
//like .comment
//add to playlist

function VIdeoPlayerComponent() {
   const {id} =useParams()
   const [video, setvideo] = useState(null)
   const [videoFile, setvideoFile] = useState(null)

   useEffect(() => {
     VideoService.getVideoById({id})
     .then((res)=>{ 
        setvideo(res.data.data)
        setvideoFile(res.data.data.videoFile.url)
    })
    .catch(err=>console.log("videoplayercomponent-->error-->",err))
   }, [id])

   
  return (
    <div className='flex flex-col justify-center items-center p-11 '>
        <video className="w-full rounded-t-3xl" controls autoPlay src={videoFile}>
      
      Your browser does not support the video tag.
    </video>
    <div className='shadow-lg w-full p-10 rounded-b-3xl'>
        like share and subscript
    </div>
    </div>
  )
}

export default VIdeoPlayerComponent