import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Like = sequelize.define(
  "Like",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "likes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["postId", "userId"],
      },
    ],
  },
);

export default Like;
