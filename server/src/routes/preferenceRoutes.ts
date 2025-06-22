import { Router } from "express";
import { getPreferences, addPreference, deletePreference } from "../controllers/preferenceController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.get("/preferences", authenticateJWT("user"), getPreferences);
router.post("/preferences", authenticateJWT("user"), addPreference);
router.delete("/preferences/:category", authenticateJWT("user"), deletePreference);

export default router;