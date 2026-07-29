import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addComment,
  getCommentsByPost,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Get all comments of a post
router.get("/post/:postId", getCommentsByPost);

// Add a new comment
router.post("/post/:postId", authMiddleware, addComment);

// Delete a comment
router.delete("/:id", authMiddleware, deleteComment);

export default router;
