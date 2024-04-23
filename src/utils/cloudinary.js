import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRTE_KEY 
});

const uploadOnCloudinary= async (localFIle)=>{
    try {
        if(!localFIle) return null

      const response= await cloudinary.uploader.upload(localFIle,{resource_type:'auto'})
      console.log("file upload successfull",response.url)
      return response
    } catch (error) {
        fs.unlinkSync(localFIle)
        return null
    }
}

export {uploadOnCloudinary}