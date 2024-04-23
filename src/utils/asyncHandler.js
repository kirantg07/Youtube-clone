const asyncHandler =(fn)= async(req,res,next)=>{
    Promise.resolve(requestHandler()).catch((error)=>next(err))
}

export {asyncHandler}