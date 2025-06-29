import { Router } from "express";
import { PreferenceController } from "../controllers/PreferenceController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { Roles } from "../../shared/constants/Roles";
import { MongoPreferenceRepository } from "../../infrastructure/database/mongodb/repositories/MongoPreferenceRepository";
import { MongoUserRepository } from "../../infrastructure/database/mongodb/repositories/MongoUserRepository";
import { GetPreferencesUseCase } from "../../application/use-cases/preference/GetPreferencesUseCase";
import { AddPreferenceUseCase } from "../../application/use-cases/preference/AddPreferenceUseCase";
import { RemovePreferenceUseCase } from "../../application/use-cases/preference/RemovePreferenceUseCase";
import { CreatePreferenceUseCase } from "../../application/use-cases/preference/CreatePreferenceUseCase";
import { DeletePreferenceUseCase } from "../../application/use-cases/preference/DeletePreferenceUseCase";
import { GetUserPreferencesUseCase } from "../../application/use-cases/preference/GetUserPreferenceUseCase";

const preferenceRepository = new MongoPreferenceRepository();
const userRepository = new MongoUserRepository();

const preferenceController = new PreferenceController(
  new GetPreferencesUseCase(preferenceRepository),
  new GetUserPreferencesUseCase(userRepository),
  new AddPreferenceUseCase(userRepository, preferenceRepository),
  new RemovePreferenceUseCase(userRepository, preferenceRepository),
  new CreatePreferenceUseCase(preferenceRepository),
  new DeletePreferenceUseCase(preferenceRepository)
);

const router = Router();

// Public endpoint
router.get("/preferences", preferenceController.getPreferences.bind(preferenceController));

// User endpoints
router.get("/user/preferences", authenticateJWT(Roles.User), preferenceController.getPreferences.bind(preferenceController));
router.post("/preferences", authenticateJWT(Roles.User), preferenceController.addPreference.bind(preferenceController));
router.delete("/preferences/:category", authenticateJWT(Roles.User), preferenceController.removePreference.bind(preferenceController));

// Admin endpoints
router.get("/admin/preferences", authenticateJWT(Roles.Admin), preferenceController.getPreferences.bind(preferenceController));
router.post("/", authenticateJWT(Roles.Admin), preferenceController.createPreference.bind(preferenceController));
router.delete("/admin/preferences/:category", authenticateJWT(Roles.Admin), preferenceController.deletePreference.bind(preferenceController));

export default router;