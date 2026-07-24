import { Router } from "express";
import opportunityRoutes from "./opportunity.route.js"
const router = Router();
router.use('/opportunities', opportunityRoutes);
export default router;