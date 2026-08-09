import express from "express";
import { connectDB } from "./DB/connection.js";
import { bootStrap } from "./app.controller.js";
import { config } from "./config/dev.env.js";
import { connectRedis } from "./DB/redisConnection.js";

const app = express();
async function startServer() {
  connectDB();
  connectRedis();

  bootStrap(app, express);
  const port = config.port || 3000;
  app.listen(port, () => {
    console.log("application is running on port", port);
  });
}
startServer().catch((error) => {
  console.error("failed to start application", error);
  process.exit(1);
});

export default app;
