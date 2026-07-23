import mongoose  from "mongoose";

async function ConnectDB() {
    
await mongoose.connect(process.env.MONGODBURL)

}

export default ConnectDB






