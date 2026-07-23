import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'
import AppError, { catchAsync } from '../utils/CommonError.js'



export const authUser = catchAsync(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        throw new AppError('Access denied: Authentication token missing', 401);
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decode.id);
        if (!user) {
            throw new AppError('The user belonging to this token no longer exists', 404);
        }

        req.user = user;
        next();
    } catch (error) {
        // token expired
        if (error.name === 'TokenExpiredError') {
            throw new AppError('Your session has expired. Please log in again.', 401);
        }
        throw new AppError('Invalid authentication token', 401);
    }
});
