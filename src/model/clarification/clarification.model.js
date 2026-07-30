import mongoose from "mongoose";
import { clarificationSchema } from "./clarification.schema.js";

const Clarification = mongoose.model("Clarification", clarificationSchema);
export default Clarification;
