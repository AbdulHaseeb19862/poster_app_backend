import sequilize from "sequelize";
import Comment from "./Comment.js";
import Post from "./Post.js";
import Like from "./Like.js";
import User from "./User.js";

/* USER <-> POST */
User.hasMany(Post, { foreignKey: "userId", as: "posts", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "userId", as: "author" });

/* POST <-> COMMENT */
Post.hasMany(Comment, {
  foreignKey: "postId",
  as: "comments",
  onDelete: "CASCADE",
});
Comment.belongsTo(Post, { foreignKey: "postId" });

/* USER <-> COMMENT */
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId", as: "commenter" });

/* COMMENT <-> COMMENT (REPLY LOGIC) */
Comment.hasMany(Comment, {
  foreignKey: "parentId",
  as: "replies",
  onDelete: "CASCADE",
});

Comment.belongsTo(Comment, { foreignKey: "parentId", as: "parentComment" });

/* POST <-> LIKE */

Post.hasMany(Like, { foreignKey: "postId", as: "likes", onDelete: "CASCADE" });
Like.belongsTo(Post, { foreignKey: "postId" });

/* USER <-> LIKE */
User.hasMany(Like, { foreignKey: "userId" });
Like.belongsTo(User, { foreignKey: "userId", as: "likedBy" });

export default { sequelize, User, Post, Comment, Like };

// ---------------- REGISTER ----------------

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email aur password is required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User successfully registered",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
