import express from "express"
import { connectDB } from "./DB/connection.js";
import { bootStrap } from "./app.controller.js";
import { devConfig } from "./config/dev.env.js";

const app = express();
async function startServer() {    
    connectDB();
    bootStrap(app, express);
    const port = devConfig.PORT || 3000;
    app.listen(port, () => {
        console.log("application is running on port", port);
    });
}
startServer().catch((error) => {
    console.error("failed to start application", error);
    process.exit(1);
});

export default app;