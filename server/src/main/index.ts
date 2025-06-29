import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDB } from "../infrastructure/database/mongodb/config/db";

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error);
});