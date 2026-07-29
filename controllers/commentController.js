import { User, Comment } from "../models";

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, parentId } = req.body;
    if (!text) {
      return res.status(400).json({ message: "For Comment text is required" });
    }

    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment) {
        return res
          .status(404)
          .json({ message: "Comment Does not exist for comment" });
      }
    }

    const comment = await Comment.create({
      text,
      postId,
      userId: req.user.id,
      parentId: parentId || null,
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: "commenter", attributes: ["id", "name"] }],
    });

    res.status(201).json({
      message: parentId
        ? "Reply added successfully"
        : "Comment added successfully",

      comment: commentWithUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- GET ALL COMMENTS of a post (nested with replies) ---------------

export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId, parentId: null },
      include: [
        { model: User, as: "commenter", attributes: ["id", "name"] },
        {
          model: Comment,
          as: "replies",
          include: [
            { model: User, as: "commenter", attributes: ["id", "name"] },
          ],
          order: [["createdAt", "ASC"]],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- DELETE COMMENT ----------------

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: "There is no comment" });
    }

    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You cant't delete this commnent" });
    }

    await comment.destroy();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
