
import express from 'express'
import { editProfile, getOneUser, getOthers, getProfile } from '../controllers/userController.js'
import { authUser } from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()



userRouter.get('/get-profile' , authUser , getProfile)
userRouter.get('/get-allusers', authUser , getOthers )
userRouter.patch('/edit-profile', authUser, upload.single('image'),editProfile  )
userRouter.get('/get-selected-user/:userId',authUser,  getOneUser )




export default userRouter


