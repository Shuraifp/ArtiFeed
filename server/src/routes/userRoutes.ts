import { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser, blockUser } from "../controllers/userController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.get("/users", authenticateJWT("admin"), getUsers);
router.get("/users/:id", authenticateJWT("user"), getUserById);
router.put("/users/:id", authenticateJWT("user"), updateUser);
router.delete("/users/:id", authenticateJWT("admin"), deleteUser);
router.post("/users/:id/block", authenticateJWT("admin"), blockUser);

export default router;