import { Router } from "express";
import { signup, login, adminLogin } from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/admin/login", adminLogin);

export default router;