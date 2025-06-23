import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import articleRoutes from "./routes/articleRoutes";
import preferenceRoutes from "./routes/preferenceRoutes";
import statsRoutes from "./routes/statRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/preference", preferenceRoutes);
app.use("/api/stat", statsRoutes);
app.use(errorHandler);

export default app;