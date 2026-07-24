import { model } from "mongoose";
import { opporunitySchema } from "./opportunity.schema";

const Opportunity = model("opportunity",opporunitySchema);
export default Opportunity;