import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { Roles } from "../../shared/constants/Roles";
import { MongoUserRepository } from "../../infrastructure/database/mongodb/repositories/MongoUserRepository";
import { MongoArticleRepository } from "../../infrastructure/database/mongodb/repositories/MongoArticleRepository";
import { MongoArticleReactionRepository } from "../../infrastructure/database/mongodb/repositories/MongoArticleReactionRepository";
import { PasswordHasher } from "../../domain/services/PasswordHasher";
import { CreateUserUseCase } from "../../application/use-cases/user/CreateUserUseCase";
import { GetUsersUseCase } from "../../application/use-cases/user/GetUsersUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/user/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../../application/use-cases/user/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../application/use-cases/user/DeleteUserUseCase";
import { ToggleBlockUserUseCase } from "../../application/use-cases/user/ToggleBlockUserUseCase";
import { GetStatsUseCase } from "../../application/use-cases/user/GetStatsUseCase";
import { GetAdminStatsUseCase } from "../../application/use-cases/user/GetAdminStatsUseCase";

const userRepository = new MongoUserRepository();
const articleRepository = new MongoArticleRepository();
const articleReactionRepository = new MongoArticleReactionRepository();
const passwordHasher = new PasswordHasher();

const userController = new UserController(
  new CreateUserUseCase(userRepository, passwordHasher),
  new GetUsersUseCase(userRepository),
  new GetUserByIdUseCase(userRepository),
  new UpdateUserUseCase(userRepository, passwordHasher),
  new DeleteUserUseCase(userRepository),
  new ToggleBlockUserUseCase(userRepository),
  new GetStatsUseCase(userRepository, articleRepository, articleReactionRepository),
  new GetAdminStatsUseCase(userRepository, articleRepository, articleReactionRepository)
);

const router = Router();

router.post("/", userController.createUser.bind(userController));
router.get("/admin", authenticateJWT(Roles.Admin), userController.getUsers.bind(userController));
router.get("/", authenticateJWT(Roles.User), userController.getUserById.bind(userController));
router.put("/", authenticateJWT(Roles.User), userController.updateUser.bind(userController));
router.delete("/:id", authenticateJWT(Roles.Admin), userController.deleteUser.bind(userController));
router.post("/block/:id", authenticateJWT(Roles.Admin), userController.toggleBlockUser.bind(userController));
router.get("/count", userController.getStats.bind(userController));
router.get("/admin/stats", authenticateJWT(Roles.Admin), userController.getAdminStats.bind(userController));

export default router;