import { Router } from "express";
import { getStats } from "../controllers/statController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.get("/stats", authenticateJWT("admin"), getStats);

export default router;