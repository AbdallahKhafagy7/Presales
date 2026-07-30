import { technologyCatalogSchema } from "./technology-catalog.schema.js";
import { model } from "mongoose";

const TechnologyCatalog = model("TechnologyCatalog", technologyCatalogSchema);
export default TechnologyCatalog;
