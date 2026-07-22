import mongoose from "mongoose";
import { config } from "../config/dev.env.js";
export async function connectDB() {
    
    if(!config.mongoUri){
        
        throw new Error ("MongoDB_URI is not configured");
    }
    await mongoose.connect(config.mongoUri,{
        timeoutMS:30000,
    }).then(() => {
        console.log("DB connected successfully");
    });;
    
}