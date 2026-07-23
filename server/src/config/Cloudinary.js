import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

const cloudinaryConnect = ()=>{

try {

cloudinary.config({

cloud_name : process.env.CLOUD_NAME,
api_key : process.env.CLOUD_API_KEY ,
api_secret : process.env.CLOUD_API_SECRET

})
console.log('Cloudinary connected');


} catch (err) {
console.log('Error in cloudinary :', err);

}}


export default cloudinaryConnect



