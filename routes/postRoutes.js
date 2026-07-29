import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", authMiddleware, createPost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
