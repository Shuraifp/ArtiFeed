import { Router } from "express";
import {
  getPreferences,
  addPreference,
  removePreference,
  deletePreference,
  createPreference
} from "../controllers/preferenceController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.get("/preferences", getPreferences);

router.get("/user/preferences", authenticateJWT("user"), getPreferences);
router.post("/preferences", authenticateJWT("user"), addPreference);
router.delete("/preferences/:category", authenticateJWT("user"), removePreference);

router.get("/admin/preferences", authenticateJWT("admin"), getPreferences);
router.post("/", authenticateJWT("admin"), createPreference);
router.delete("/admin/preferences/:category", authenticateJWT("admin"), deletePreference);

export default router;
