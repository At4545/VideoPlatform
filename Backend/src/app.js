import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app= express()

app.use(cors({
    origin: "*"
}))

app.use(express.json({
    limit:"16kb"
}))
app.use(express.urlencoded({
    limit:"16",
    extended:true //if we want to send json inside json
}))
app.use(express.static("public"))

app.use(cookieParser())

//controllers

//Router import 
import userRouter from "./routes/user.route.js"
import subscriptionRouter from "./routes/subscription.route.js"
import healthCheckRouter from "./routes/healthCheck.route.js"
import videoRouter from "./routes/video.route.js"
import likeRouter from "./routes/like.route.js"
import dashboardRouter from "./routes/dashboard.route.js"
import commentRouter from "./routes/comment.route.js"
import playlistRouter from "./routes/playlist.route.js"
import tweetPlaylist from "./routes/tweet.route.js"
//rotuer declartion

app.use("/api/v1/users",userRouter)
app.use("/api/v1/subscription",subscriptionRouter)
app.use("/api/v1/healthcheck",healthCheckRouter)
app.use("/api/v1/video", videoRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/tweet", tweetPlaylist)


export {app}