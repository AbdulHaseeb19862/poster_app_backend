import { Post, User, Comment, Like } from "../models/index.js";

// ---------------- CREATE POST ----------------

export const createPost = async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const post = await Post.create({
      title,
      content,
      imageUrl,
      userId: req.user.Id,
    });

    res.status(201).json({ message: "Post is created successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- GET ALL POSTS ----------------

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, as: "author", attributes: ["id", "name", "email"] },
        { model: Like, as: "likes" },
      ],
      order: [["createdAt", "DESC"]],
    });
    const postsWithLikeCount = posts.map((post) => {
      const p = post.toJSON();
      p.likes = p.likes.length;
      return p;
    });
    res.status(200).json({ posts: postsWithLikeCount });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- GET SINGLE POST (with comments+replies) ----------------

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, {
      include: [
        { model: User, as: "author", attributes: ["id", "name", "email"] },
        { model: Like, as: "likes" },
        {
          model: Comment,
          as: "comments",
          where: { parentId: null },
          required: false,
          include: [
            { model: User, as: "commenter", attributes: ["id", "name"] },
            {
              model: Comment,
              as: "replies",
              include: [
                { model: User, as: "commenter", attributes: ["id", "name"] },
              ],
            },
          ],
        },
      ],
    });
    if (!post) {
      return res.status(404).json({ message: "There is no post" });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- DELETE POST ----------------

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: "There is no post" });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: "You can't delete this post" });
    }

    await post.destroy();
    res.status(200).json({ message: "Post delete ho gayi. " });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
