import mongoose from "mongoose";
import { devConfig } from "../config/dev.env.js";
export async function connectDB() {
    
    if(!devConfig.MONGODB_URI){
        
        throw new Error ("MongoDB_URI is not configured");
    }
    await mongoose.connect(devConfig.MONGODB_URI,{
        timeoutMS:30000,
    }).then(() => {
        console.log("DB connected successfully");
    });;
    
}