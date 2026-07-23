import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import dns from 'dns'
import ConnectDB from './src/config/DB.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { errorHandler } from './src/utils/CommonError.js'
import cloudinaryConnect from './src/config/Cloudinary.js'
import authRouter from './src/routes/authRoutes.js'
import userRouter from './src/routes/userRoutes.js'
import chatRouter from './src/routes/chatRoutes.js'
import http from 'http'

import { initializeSocket } from './src/services/Socket.js'




const app = express()
//creating a native server here
const server = http.createServer(app)
//initializing sockets here
const io = initializeSocket(server)
//for gloabl access via req. object
app.set('io', io);

app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(cookieParser())



app.use(cors({
    origin : 'http://localhost:5173',
    credentials: true

}))


app.use('/api/auth' , authRouter )

app.use('/api/user', userRouter)

app.use('/api/chat', chatRouter)




app.use(errorHandler)


// for MongoDB Atlas SRV lookups
dns.setServers([
 '1.1.1.1',
 '8.8.8.8'

])




const PORT = process.env.PORT
cloudinaryConnect()

ConnectDB()
.then(()=>{
    console.log('DB is connected')
    server.listen(PORT,()=>{
        console.log('Server is running on', PORT)
        
    })
    
}).catch((error)=>{
        console.log('DB Connection is failed',error)

})







