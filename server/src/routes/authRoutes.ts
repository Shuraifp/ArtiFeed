import { Router } from "express";
import { signup, login, adminLogin, logout, refreshToken, logoutAdmin } from "../controllers/authController";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { Roles } from "../types/type";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", (req, res) => refreshToken(req, res, Roles.User));
router.post("/logout", authenticateJWT(Roles.User), logout);

router.post("/admin/login", adminLogin);
router.get("/admin/refresh", (req, res) => refreshToken(req, res, Roles.Admin));
router.post('/admin/logout', authenticateJWT(Roles.Admin), logoutAdmin)

export default router;