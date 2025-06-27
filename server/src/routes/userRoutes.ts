import { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser, toggleBlockUser, getStats, getAdminStats } from "../controllers/userController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.get("/admin", authenticateJWT("admin"), getUsers);
router.get("/", authenticateJWT("user"), getUserById);
router.put("/", authenticateJWT("user"), updateUser);
router.delete("/:id", authenticateJWT("admin"), deleteUser);
router.post("/block/:id", authenticateJWT("admin"), toggleBlockUser);

router.get("/count", getStats);
router.get("/admin/stats", authenticateJWT("admin"), getAdminStats);

export default router;