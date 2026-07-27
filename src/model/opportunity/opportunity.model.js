import { model } from "mongoose";
import { opporunitySchema } from "./opportunity.schema.js";

const Opportunity = model("opportunity",opporunitySchema);
export default Opportunity;