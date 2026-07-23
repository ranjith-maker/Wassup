
import express from 'express'
import { authUser } from '../middlewares/authUser.js'
import { getAllMessages, sendMessage } from '../controllers/chatController.js'
import upload from '../middlewares/multer.js'


const chatRouter = express.Router()



chatRouter.post('/send-message' , authUser, upload.single('image'), sendMessage)
chatRouter.get('/get-message/:receiverId', authUser, getAllMessages)



export default chatRouter






