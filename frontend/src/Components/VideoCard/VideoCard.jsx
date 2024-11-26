import React from 'react'
import logo from "../../assets/logo.png"
function VideoCard() {
  return (
    <div className='w-96 box-border'>
        <div className="mx-auto my-10 grid max-w-screen-xl ">
  <div className="group cursor mx-4 overflow-hidden rounded-2xl bg-white shadow-xl duration-200 hover:-translate-y-4">
    <div className="flex w-96 h-48 flex-col justify-between overflow-hidden">
      <img src="https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHZpZGVvZ3JhcGh5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" className="group-hover:scale-110 h-full w-full object-cover duration-200" />
    </div>
    {/* avatar and name */}
    <div className='flex m-2 gap-3'>
<div className='rounded-full h-10 w-20 bg-black text-white flex justify-center items-center'>    <img className='h-10 w-10 rounded-full bg-black' src={logo} alt="" />
</div>  
<div>
<div className='font-medium   w-full overflow-hidden text-ellipsis line-clamp-2'>my name is abhishek thakur
    this is my first video for making you fell like hell so hiii
</div> 
{/* userName */}
<div className='font-light text-gray-700'>channel name</div>
<div className='font-light text-gray-700 flex'>
    <div>10M views | </div>
    <div>| 1 year</div>
</div>
    
</div> 
    

    </div>
    
  </div>
  
</div>


    </div>
  )
}

export default VideoCard