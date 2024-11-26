import React from 'react'
import {VideoCard} from "../index.js"
function Dashboard() {
  return (
    <div>
        <div className='flex mx-6'>
        <VideoCard></VideoCard>
        <VideoCard></VideoCard>
        <VideoCard></VideoCard>
        <VideoCard></VideoCard>

    </div>
    <div className='flex mx-6'>
        <VideoCard></VideoCard>
        <VideoCard></VideoCard>
        <VideoCard></VideoCard>
        <VideoCard></VideoCard>

    </div>
    </div>
  )
}

export default Dashboard