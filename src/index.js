import dotenv from 'dotenv';

import connectDB from './db/index.js';
import {app} from './app.js';
 

dotenv.config({path:'./.env'})

connectDB() 
.then(()=>{
    app.listen(process.env.PORT || 8000)
    console.log(`Connection established : ${process.env.PORT}`);
})
.catch((err)=>{
    console.log("DB connection failed",err);
})


// (async ()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on("error",()=>{
//             console.log("ERROR :", error)
//             throw error
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port :${process.env.PORT}`)
//         })
//     }catch(error){
//         console.error("ERROR :", error)
//     }
// })()