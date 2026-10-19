import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import validator from 'validator'



const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 25,
    },

    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email address')
            }
        }
    },



    profilePicture: {
        type: String,
        default: "",
    },


    bio: {
    type: String,
    default: "",
    maxlength: 200,
    trim: true,
    },



}, { timestamps: true}

);






export default mongoose.model("User", userSchema);
