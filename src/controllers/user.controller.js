import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req, res)=>{
    const {fullName,email,password,username}= req.body
    
    if([fullName,username,password,email].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"Need all fields")
    }
    const existUser=await User.findOne({
        $or:[{email},{username}]
    })

    if(existUser){
        throw new ApiError(404,"User already exists")
    }

     const avatarLocalPath= req.files?.avatar[0]?.path;
    // //const coverImageLocalPath= req.files?.coverImage[0]?.path;
    
     let coverImageLocalPath;
     if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
     }
    if(!avatarLocalPath){
        throw new ApiError(402,"Avator is required ")
    }

    // const avatar= await uploadOnCloudinary(avatarLocalPath);
    // console.log(avatar)
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // if(!avatar){
    //     throw new ApiError(402,"Avator is required 2")
    // }

    let avatar, coverImage;

    try {
        avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar || !avatar.url) {
            throw new Error("Avatar upload failed");
        }
        
        if (coverImageLocalPath) {
            coverImage = await uploadOnCloudinary(coverImageLocalPath);
            if (!coverImage || !coverImage.url) {
                throw new Error("Cover image upload failed");
            }
        }
    } catch (error) {
        console.error("Error uploading images to Cloudinary:", error);
        throw new ApiError(500, "Image upload failed");
    }

    const  user= await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        username:username,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"User not created ")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"created sucessfully")
    )
})

const generateAccessAndRefreshTokens = async( userId)=>{

    try {
        const user = await User.findById(userId)
        const accessTken= await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {refreshToken,accessTken}
    } catch (error) {
        throw new ApiError(500,"Token generation failed")
    }
}

const loginUser = asyncHandler( async (req,res)=>{
    const {username,email,password}= req.body

    if(!email || !username){
        throw new ApiError(402,"Enter email or username")
    }

    const user = await User.findOne({
        $or:[{email},{username}]
    })

    if(!user){
        throw new ApiError(404,"User not found")
    }

    const isPasswordValid= await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(405,"Invalid credentials")
    }
    
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(User._id)

    const loggedInUser = await User.findOne(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken", accessToken,options)
    .json(
        new ApiResponse(201,{
            user:loggedInUser,refreshToken,accessToken
        },"Login successful")
    )

})

const logoutUser =  asyncHandler(async (req,res)=>{
    User.findByIdAndUpdate(req.user?._id,{
    $set:{
        refreshToken:undefined
        }
    })
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("refreshToken",options)
    .clearCookie("accessToken",options)
    .json(new ApiResponse(200,{},"Loged out sucessfully"))

})
export {registerUser,loginUser,logoutUser}