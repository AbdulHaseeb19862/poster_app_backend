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
