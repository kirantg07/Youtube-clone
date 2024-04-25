import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY 
});

const uploadOnCloudinary= async (localFile)=>{
    try {
        if(!localFile){throw new Error("No local file provided for upload");}

      const response= await cloudinary.uploader.upload(localFile,{resource_type:'auto'})
      
      fs.unlinkSync(localFile)
      return response;
    } catch (error) {
      console.error("Error uploading file to Cloudinary1:", error);
      
      if (localFile && fs.existsSync(localFile)) {
          fs.unlinkSync(localFile);
      }
      
      throw error;
    }
}

export {uploadOnCloudinary}