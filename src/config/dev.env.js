import 'dotenv/config';
export const config = { 
    port: process.env.PORT || 5000, 
    mongoUri: process.env.MONGODB_URI, 
    nodeEnv: process.env.NODE_ENV || 'development'
    , apiPrefix: process.env.API_PREFIX || '/api' 
};