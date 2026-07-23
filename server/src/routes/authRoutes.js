import express from 'express'
import { logout, sendOtp, verifyOtp } from '../controllers/authController.js'
import { uploadImagetoCloudinary } from '../utils/ImageUploader.js'
import upload from '../middlewares/multer.js'
import { authUser } from '../middlewares/authUser.js'



const authRouter = express.Router()

authRouter.post('/send-otp', sendOtp  )

authRouter.post('/verify-otp', verifyOtp  );

authRouter.post('/logout-user' , logout )




export default authRouter





