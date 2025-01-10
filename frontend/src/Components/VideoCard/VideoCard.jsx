import React from "react";
import logo from "../../assets/logo.png";
import useTimeAgo from "../../CustomHooks/useTimeAgo";
import { Link } from "react-router-dom";
import { useEffect } from "react";
function VideoCard({ video }) {
  const duration = useTimeAgo(video?.createdAt);

  return (
    <Link to={`/${video?._id}`}>
      <div className="w-full h-80 box-border cursor-pointer hover:scale-95 ">
        <div className="mx-auto my-3 grid max-w-screen-xl ">
          <div className="group cursor mx-4 overflow-hidden rounded-2xl bg-transparent ">
            <div className="flex w-full h-48 flex-col justify-between overflow-hidden">
              <img
                src={
                  video?.thumbnail.url ||
                  "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHZpZGVvZ3JhcGh5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                }
                className=" h-full w-full object-cover duration-200"
              />
            </div>
            {/* avatar and name */}
            <div className="flex m-2 gap-3">
              {/* <div className='rounded-full h-10 w-10 bg-black text-white flex justify-center items-center'>     */}
              <img
                className="h-[40px] w-[40px] rounded-full bg-black hover:border "
                src={video ? video.owner.avatar.url : logo}
                alt=""
              />
              {/* </div>   */}
              <div>
                <div className="font-medium   w-full overflow-hidden text-ellipsis line-clamp-2">
                  {video
                    ? video.title
                    : "my name is abhishek thakur this is my first video for making you fell like hell so hiii"}
                </div>
                {/* userName */}
                <div className="font-light text-gray-700">
                  {video ? video.owner.userName : "Channel Name"}
                </div>
                <div className="font-light text-gray-700 flex">
                  <div>10M views | </div>
                  <div>| {duration ? duration : "1 second ago"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;
