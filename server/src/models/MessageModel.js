import mongoose from "mongoose";



const messageSchema = new mongoose.Schema({
    // DB index string combining both user IDs (e.g., "id1_id2") improves query performance when loading chat history:
    roomId: {
        type: String,
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    }
}, { timestamps: true });


export default mongoose.model('Message', messageSchema);










//The roomId is indexed for faster chat history retrieval, and sender/receiver references allow population of user details when returning messages.
//  This design supports both persistent storage and real-time delivery through Socket.IO