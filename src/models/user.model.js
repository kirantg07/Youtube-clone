import mongoose,{Schema} from "mongoose";
import jwt,{ JsonWebTokenError } from "jsonwebtoken";
import bcrypt from 'bcrypt'
const UserSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    emial:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,//cloudnari url
        required:true,
    },
    coverImage:{
        type:String,//cloudnari url
    },
    watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Vedio"
    }],
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    refreshToken:{
        type:String,
    }
},{timestamps:true})

export const User =  mongoose.model("User",UserSchema)