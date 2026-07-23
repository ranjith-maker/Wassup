import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 300, // Automatically deletes the document after 5 minutes (300 seconds)
        },
    },
    { timestamps: true }
);


export default mongoose.model('OTP', otpSchema)









