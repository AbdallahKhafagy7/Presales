import { model } from "mongoose";
import { reqAnalysisSchema } from "./requirementAnalysis.schema.js";

const reqAnalysis = model("requirementAnalysis",reqAnalysisSchema);
export default reqAnalysis;