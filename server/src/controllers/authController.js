import User from '../models/UserModel.js'
import Message from '../models/MessageModel.js'
import jwt from 'jsonwebtoken' 
import validator from 'validator'
import AppError , {catchAsync} from '../utils/CommonError.js'
import crypto from 'crypto';
import bcrypt from 'bcrypt'
import { sendOtptoEmail } from '../services/EmailServices.js'
import OTP from '../models/OTPMode.js'



export const sendOtp = catchAsync(async (req, res, next) => {
    const { email, name } = req.body;

    if (!email) {
        return next(new AppError("Email is required", 400));
    }

    if (!validator.isEmail(email)) {
        return next(new AppError("Please enter a valid email address", 400));
    }

    // Check if user already exists in the database
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    // If they DON'T exist, it's a Signup flow -> Name is mandatory!
    if (!existingUser && (!name || !name.trim())) {
        return next(new AppError("Name is required for new user registration", 400));
    }

    // Generate a secure, guaranteed 6-digit numeric string OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Clean up old OTPs entries for this email before creating a new one
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Save the new OTP record
    await OTP.create({
        email: email.toLowerCase(),
        otp: otp
    });

    // Fire the email
    await sendOtptoEmail(email.toLowerCase()  , otp);

    return res.status(200).json({
        success: true,
        message: "Verification code sent to your email"
    });
});



export const verifyOtp = catchAsync(async (req, res, next) => {
    const { email, otp, name } = req.body;

    if (!email || !otp) {
        return next(new AppError("Email and OTP code are required", 400));
    }

    const normalizedEmail = email.toLowerCase();

    // 1. Locate the OTP record matching this email and code
    const otpRecord = await OTP.findOne({ email: normalizedEmail, otp });
    
    if (!otpRecord) {
        return next(new AppError("Invalid or expired OTP", 400));
    }

    // 2. Fetch or create the user profile since OTP is correct
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        // Fallback safety verification for signup data
        if (!name || !name.trim()) {
            return next(new AppError("Registration data missing. Please try signing up again.", 400));
        }
        // Save new user profile permanently to the DB
        user = await User.create({
            name: name.trim(),
            email: normalizedEmail
        });
    }


    // 3. Construct JWT Payload (Valid for 2 days)
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '2d' }
    );

    // 4. deleting the verified OTP record immediately so it can never be reused
    await OTP.deleteOne({ _id: otpRecord._id });

  
    res.cookie('token', token, {
        httpOnly: true, 
        secure: false,
        sameSite: 'lax', 
        maxAge: 2 * 24 * 60 * 60 * 1000 
    });

    // 6. Return response to home route redirection
    return res.status(200).json({
        success: true,
        message: "Authenticated successfully",
        data : user
     
        
    });
});





export const logout = catchAsync(async(req , res , next)=>{

res.clearCookie('token', {
        httpOnly: true, 
        secure: false,
        sameSite: 'lax', 
    });

res.status(200).json({
    success : true,
    message : 'User Loggedout successfully'

})

})






// export const updateProfile = catchAsync(async(req , res, next)=>{

// const { username, agreed , bio } = req.body

// const user = req.user

// let file = req.file
// let profilePicture = req.body.profilePicture

// if(file){
//     const result = await uploadImagetoCloudinary(file)

//  if (result) {
//     user.profilePicture = result.secure_url;
// }

// }else if(profilePicture){
//     user.profilePicture = profilePicture
// }

// if(username) user.username = username
// if(agreed) user.agreed = agreed
// if(bio) user.bio = bio 

// await user.save()


// return res.status(200).json({
//     success : true ,
//     message : 'Profile Created successfully',
//     data : req.user
// })

// })

