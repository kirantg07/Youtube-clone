import express from 'express'
import cros from 'cors'
import cookieParser from 'cookie-parser'


const app = express()
app.use(cros({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routs/user.router.js'

app.use("/api/v1/users",userRouter)

export { app }