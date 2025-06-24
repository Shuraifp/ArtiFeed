import { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser, blockUser, getStats } from "../controllers/userController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.get("/users", authenticateJWT("admin"), getUsers);
router.get("/", authenticateJWT("user"), getUserById);
router.put("/", authenticateJWT("user"), updateUser);
router.delete("/:id", authenticateJWT("admin"), deleteUser);
router.post("/block/:id", authenticateJWT("admin"), blockUser);

router.get("/count", getStats);

export default router;