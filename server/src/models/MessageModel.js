import mongoose from "mongoose";



const messageSchema = new mongoose.Schema({
    // Our database index string combining both user IDs (e.g., "id1_id2")
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


