import { technologyCatalogSchema } from "./technology-catalog.schema";
import { model } from "mongoose";

const TechnologyCatalog = model("TechnologyCatalog", technologyCatalogSchema);
export default TechnologyCatalog;
