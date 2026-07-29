import express from "express";
import authMiddleware from "../middleware/auth.js";
import { toggleLike, getLikesCount } from "../controllers/likeController.js";

const router = express.Router();

// Like / Unlike a post
router.post("/post/:postId", authMiddleware, toggleLike);

// Get total likes of a post
router.get("/post/:postId", getLikesCount);

export default router;
