import { Router } from "express";
import { ArticleController } from "../controllers/ArticleController";
import { Roles } from "../../shared/constants/Roles";
import { CreateArticleUseCase } from "../../application/use-cases/article/CreateArticlesUseCase";
import { ReadTimeCalculator } from "../../domain/services/ReadTimeCalculator";
import { MongoArticleRepository } from "../../infrastructure/database/mongodb/repositories/MongoArticleRepository";
import { MongoUserRepository } from "../../infrastructure/database/mongodb/repositories/MongoUserRepository";
import { authenticateJWT } from "../middleware/authMiddleware";
import { GetArticlesUseCase } from "../../application/use-cases/article/GetArticlesUseCase";
import { GetArticlesbyUserUseCase } from "../../application/use-cases/article/GetArticlesbyUserUseCase";
import { UpdateArticleUseCase } from "../../application/use-cases/article/UpdateArticleUseCase";
import { GetAllArticlesUseCase } from "../../application/use-cases/article/GetAllArticlesUseCase";
import { MongoArticleReactionRepository } from "../../infrastructure/database/mongodb/repositories/MongoArticleReactionRepository";
import { DislikeArticleUseCase } from "../../application/use-cases/article/DislikeArticleUseCase";
import { DeleteArticleUseCase } from "../../application/use-cases/article/DeleteArticleUseCase";
import { LikeArticleUseCase } from "../../application/use-cases/article/LikeArticleUseCase";
import { BlockArticleUseCase } from "../../application/use-cases/article/BlockArticleUseCase";
import { AdminToggleBlockArticleUseCase } from "../../application/use-cases/article/AdminToggleBlockArticleUseCase";
import { GetArticlesForAdminUseCase } from "../../application/use-cases/article/GetArticlesForAdminUseCase";

const articleRepository = new MongoArticleRepository();
const userRepository = new MongoUserRepository();
const articleReactionRepository = new MongoArticleReactionRepository();
const readTimeCalculator = new ReadTimeCalculator();

const articleController = new ArticleController(
  new CreateArticleUseCase(
    articleRepository,
    userRepository,
    readTimeCalculator
  ),
  new UpdateArticleUseCase(articleRepository),
  new GetArticlesUseCase(articleRepository, userRepository),
  new GetArticlesbyUserUseCase(articleRepository, userRepository),
  new GetAllArticlesUseCase(articleRepository),
  new DeleteArticleUseCase(articleRepository, userRepository),
  new LikeArticleUseCase(
    articleRepository,
    userRepository,
    articleReactionRepository
  ),
  new DislikeArticleUseCase(
    articleRepository,
    userRepository,
    articleReactionRepository
  ),
  new BlockArticleUseCase(articleRepository, userRepository),
  new AdminToggleBlockArticleUseCase(articleRepository),
  new GetArticlesForAdminUseCase(articleRepository)
);

const router = Router();

router.post(
  "/",
  authenticateJWT(Roles.User),
  articleController.createArticle.bind(articleController)
);
router.get(
  "/",
  authenticateJWT(Roles.User),
  articleController.getUnBlockedArticles.bind(articleController)
);
router.get(
  "/following",
  authenticateJWT(Roles.User),
  articleController.getPreferedArticles.bind(articleController)
);
router.get(
  "/user",
  authenticateJWT(Roles.User),
  articleController.getArticlesbyUser.bind(articleController)
);
router.put(
  "/:articleId",
  authenticateJWT(Roles.User),
  articleController.updateArticle.bind(articleController)
);
router.delete(
  "/:articleId",
  authenticateJWT(Roles.User),
  articleController.deleteArticle.bind(articleController)
);
router.post(
  "/:articleId/like",
  authenticateJWT(Roles.User),
  articleController.likeArticle.bind(articleController)
);
router.post(
  "/:articleId/dislike",
  authenticateJWT(Roles.User),
  articleController.dislikeArticle.bind(articleController)
);
router.post(
  "/:articleId/block",
  authenticateJWT(Roles.User),
  articleController.blockArticle.bind(articleController)
);


// Admin
router.get(
  "/admin",
  authenticateJWT(Roles.Admin),
  articleController.getAllArticles.bind(articleController)
);
router.post(
  "/:articleId/admin-block",
  authenticateJWT(Roles.Admin),
  articleController.adminBlockArticle.bind(articleController)
);
router.post(
  "/:articleId/admin-unblock",
  authenticateJWT(Roles.Admin),
  articleController.adminUnBlockArticle.bind(articleController)
);
export default router;
