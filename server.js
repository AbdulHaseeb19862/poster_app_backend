import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Poster App api is running");
});

const PORT = process.env.PORT || 5000;

// Database Sync
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on : http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database is not connected:", err);
  });
