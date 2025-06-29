import { Router } from "express";
import { StatsController } from "../controllers/StatsController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { Roles } from "../../shared/constants/Roles";
import { MongoUserRepository } from "../../infrastructure/database/mongodb/repositories/MongoUserRepository";
import { MongoArticleRepository } from "../../infrastructure/database/mongodb/repositories/MongoArticleRepository";
import { GetStatsUseCase } from "../../application/use-cases/stats/GetStatsUseCase";

const userRepository = new MongoUserRepository();
const articleRepository = new MongoArticleRepository();
const statsController = new StatsController(new GetStatsUseCase(userRepository, articleRepository));

const router = Router();

router.get("/stats", authenticateJWT(Roles.Admin), statsController.getStats.bind(statsController));

export default router;

