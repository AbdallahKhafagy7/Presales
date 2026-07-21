import { config } from "dotenv";
config();
export const devConfig ={
    PORT:process.env.PORT,
    MONGODB_URI:process.env.MONGODB_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    API_KEY:process.env.API_KEY
} 