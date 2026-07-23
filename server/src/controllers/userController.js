import User from '../models/UserModel.js'
import Message from '../models/MessageModel.js'
import jwt from 'jsonwebtoken' 
import AppError , {catchAsync} from '../utils/CommonError.js'
import { uploadImagetoCloudinary } from '../utils/ImageUploader.js'


//to persist the user across pages in redux
export const getProfile = catchAsync(async(req , res , next)=>{
    const user = req.user
    res.status(200).json({
        success : true,
        message : 'User Data is fetched successfully',
        data :  user
    })
})




export const editProfile = catchAsync(async (req, res, next) => {

    const { bio } = req.body;
    const user = req.user;
    let image = req.file;


    if (!bio?.trim() && !image) {
        throw new AppError('At least one field (Bio, or Profile) is required to update', 400);
    }


    if (image) {
        const result = await uploadImagetoCloudinary(image);
        if (!result) {
            throw new AppError("Image upload failed", 500);
        }
        user.profilePicture = result.secure_url;
    }


    if (bio) user.bio = bio.trim();
    
    await user.save();
    const io = req.app.get('io');
    if (io) {
        io.emit('user_profile_updated', user);
    }

    // 5. Return payload wrapped in the data envelope (parsed properly by frontend)
    return res.status(200).json({
        success: true,
        message: 'Profile Edited Successfully',
        data: user
    });
});




export const getOthers = catchAsync(async(req , res, next)=>{
    const users = await User.find({
        _id : {$ne: req.user._id}
    })

    if(!users || users.length === 0){
        throw new AppError('Could not fetch other users', 404)
    }

    return res.status(200).json({
        success : true,
        message : 'Fetched all users',
        data : users
    })
})

export const getOneUser = catchAsync(async(req,res,next)=>{


const {userId} = req.params

if(!userId){
    throw new AppError('User id is required',400)
}

const user = await User.findById(userId)

if(!user){
    throw new AppError('User not found',404)
}

res.status(200).json({
    success : true,
    message:'User fetched successfully',
    data : user
})



})


