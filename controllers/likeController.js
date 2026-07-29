import { Like } from "../models";

exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const existingLike = await Like.findOne({ where: { postId, userId } });

    if (existingLike) {
      await existingLike.destroy();
      return res
        .status(200)
        .json({ message: "Post is remove from Like", like: false });
    } else {
      await Like.create({ postId, userId });
      return res.status(201).json({ message: "Post is mark Like", like: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
