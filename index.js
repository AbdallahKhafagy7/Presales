import express from "express";
import mongoose from "mongoose";
import globalErrorHandler from "./utils/globalErrorHandler.js";
import opportunityRouter from "./routes/opportunity.js";
import opportunityRequirementRouter from "./routes/opportunityRequirement.js";
import requirementFileRouter from "./routes/requirementFile.js";
import notFoundHandler from "./utils/notFoundHandler.js";

// =========== Express App ===========

const app = express();

app.use(express.json());
app.use(express.static("./static"));

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.use("/api/opportunities", opportunityRouter);

app.use(notFoundHandler);

app.use(globalErrorHandler);

// =========== Server Initialization ===========

const port = process.env.PORT || 8080;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully!");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (e) {
    console.error(`Server couldn't start, error: ${e}`);
    process.exit(0);
  }
}

start();
