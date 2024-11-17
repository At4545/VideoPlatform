import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

 // Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:  process.env.CLOUDINARY_API_KEY, 
    api_secret:  process.env.CLOUDINARY_API_SECRET// Click 'View Credentials' below to copy your API secret
});

const uploadFileOnCloudinary= async (localFile)=>{
    try {
        if(!localFile) return null
        const response =await cloudinary.uploader.upload( localFile,{ resource_type : "auto"})
        // console.log("cloudinary.js-->The file has uploaded:",response.url)
        fs.unlinkSync(localFile)
        return response
        
    } catch (error) {
        console.log("cloudnary.js-->error-->",error)
        fs.unlinkSync(localFile) // remove the locally save temporary saved file on the system
    }
}
const deleteFileOnCloudinary=async (public_id,isvideo)=>{
    try {
        if(!public_id.trim()) return null
        let response
        if(isvideo){
            response =await cloudinary.uploader.destroy(public_id,{resource_type:"video"})
        }
        else{
             response =await cloudinary.uploader.destroy(public_id)
        }
        return response
        
    } catch (error) {
        console.log("cloudnary.js-->error-->",error)
    }
}

export { uploadFileOnCloudinary,deleteFileOnCloudinary}