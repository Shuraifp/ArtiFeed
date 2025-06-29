import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { Roles } from "../../shared/constants/Roles";
import { MongoUserRepository } from "../../infrastructure/database/mongodb/repositories/MongoUserRepository";
import { PasswordHasher } from "../../domain/services/PasswordHasher";
import { JwtService } from "../../infrastructure/auth/JwtService";
import { SignupUseCase } from "../../application/use-cases/auth/SignupUseCase";
import { LoginUseCase } from "../../application/use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "../../application/use-cases/auth/LogoutUseCase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/RefreshTokenUseCase";

const userRepository = new MongoUserRepository();
const passwordHasher = new PasswordHasher();
const jwtService = new JwtService();

const authController = new AuthController(
  new SignupUseCase(userRepository, passwordHasher, jwtService),
  new LoginUseCase(userRepository, passwordHasher, jwtService),
  new LogoutUseCase(),
  new RefreshTokenUseCase(userRepository, jwtService)
);

const router = Router();

router.post("/signup", authController.signup.bind(authController));
router.post("/login", authController.login.bind(authController));
router.get("/refresh", (req, res, next) => authController.refreshToken(req, res, Roles.User, next));
router.post("/logout", authenticateJWT(Roles.User), authController.logout.bind(authController));

router.post("/admin/login", authController.adminLogin.bind(authController));
router.get("/admin/refresh", (req, res, next) => authController.refreshToken(req, res, Roles.Admin, next));
router.post("/admin/logout", authenticateJWT(Roles.Admin), authController.adminLogout.bind(authController));

export default router;