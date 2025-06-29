import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import articleRoutes from "../presentation/routes/articleRoutes";
import userRoutes from "../presentation/routes/userRoutes";
import preferenceRoutes from "../presentation/routes/preferenceRoutes";
import authRoutes from "../presentation/routes/authRoutes";
import { errorHandler } from "../presentation/middleware/errorHandler";

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use("/api/article", articleRoutes);
app.use("/api/user", userRoutes);
app.use("/api/preference", preferenceRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

export default app;
