
//for every error we write
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    
    this.statusCode = statusCode;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;



//To not write after catch errorafter response actch(err){next(err)}

export const errorHandler = (err, req, res, next) => {
    console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });

};




//To not write try catch evrywhere
export const catchAsync = (myErrorfn) =>
(req,res,next) =>
Promise.resolve(myErrorfn(req,res,next)).catch(next);



