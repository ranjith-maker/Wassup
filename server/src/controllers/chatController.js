import Message from "../models/MessageModel.js";
import AppError, { catchAsync } from "../utils/CommonError.js";
import { uploadImagetoCloudinary } from "../utils/ImageUploader.js";
import { getReceiverSocketId } from '../services/Socket.js'


/**
 * Helper function to generate a consistent roomId.
 * Numerical or alphabetical sorting guarantees that whether User A clicks User B,
 * or User B clicks User A, they are directed to the exact same history string block.
 */
export const sendMessage = catchAsync(async (req, res, next) => {
    
    const senderId = req.user._id;
    const { receiverId, content } = req.body;
    const image = req.file;

// console.log('sent message');


    if (!receiverId) {
        throw new AppError('Receiver ID is required to route message', 400);
    }

    if ((!content || !content.trim()) && !image) {
        throw new AppError("Cannot send an empty message", 400);
    }

    // 1. Process image file if attached
    let imageUrl = "";
    if (image) {
        const result = await uploadImagetoCloudinary(image);
        if (!result) {
            throw new AppError("Image processing layer failed", 500);
        }
        imageUrl = result.secure_url;
    }

    // 2. Generate the sorted unique roomId hash string ("id1_id2")
    const roomId = [senderId.toString(), receiverId.toString()].sort().join("_");

    // 3. Create the document record entry in MongoDB
    const newMessage = await Message.create({
        roomId,
        sender: senderId,
        receiver: receiverId,
        content: content || "",
        imageUrl: imageUrl
    });

    // 4. Populate profile fields using "name" property from your User Schema
    const populatedMessage = await Message.findById(newMessage._id)
        .populate("sender", "name profilePicture")
        .populate("receiver", "name profilePicture");

    // 5. Fire directly across Socket to receiver if they are actively connected
    const io = req.app.get("io");
    const receiverSocketId = getReceiverSocketId(receiverId.toString());
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }
    // console.log("Receiver ID:", receiverId.toString());
    // console.log("Receiver socket:", receiverSocketId);
    
    return res.status(201).json({
        success: true,
        message: 'Message processed and sent',
        data: populatedMessage
    });
});

/**
 * 2. Get All Messages (Chat History)
 * Performs a fast single B-Tree index query lookup on the flat message collection.
 */

export const getAllMessages = catchAsync(async (req, res, next) => {
    const senderId = req.user._id;
    const { receiverId } = req.params;


// console.log('receive msg');


    if (!receiverId) {
        throw new AppError("Target contact query parameters are missing", 400);
    }

    const roomId = [senderId.toString(), receiverId.toString()].sort().join("_");



    // Grab logs matching this room identifier hash sorted chronologically from old to new
    const messages = await Message.find({ roomId })
        .populate("sender", "name profilePicture")
        .populate("receiver", "name profilePicture")
        .sort({ createdAt: 1 });

    return res.status(200).json({
        success: true,
        message: "Message logs fetched cleanly",
        data: messages
    });
});





