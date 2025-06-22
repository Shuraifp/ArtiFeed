import { Router } from "express";
import {
  createArticle,
  getArticles,
  getUserArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  likeArticle,
  dislikeArticle,
  blockArticle,
  adminBlockArticle,
} from "../controllers/articleController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.post("/articles", authenticateJWT("user"), createArticle);
router.get("/articles", authenticateJWT("user"), getArticles);
router.get("/articles/user", authenticateJWT("user"), getUserArticles);
router.get("/articles/:id", authenticateJWT("user"), getArticleById);
router.put("/articles/:id", authenticateJWT("user"), updateArticle);
router.delete("/articles/:id", authenticateJWT("user"), deleteArticle);
router.post("/articles/:id/like", authenticateJWT("user"), likeArticle);
router.post("/articles/:id/dislike", authenticateJWT("user"), dislikeArticle);
router.post("/articles/:id/block", authenticateJWT("user"), blockArticle);
router.post("/articles/:id/admin-block", authenticateJWT("admin"), adminBlockArticle);

export default router;