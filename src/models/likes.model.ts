import { DataTypes } from "sequelize"; 
import sequelize from "../config/db";

const Likes = sequelize.define(
   "likes",
  {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      speak_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      created_at: {
        type: DataTypes.STRING,
        allowNull:false,
      },
  },
  {

  }
);

Likes.sync().then(() => {}).catch((err: any) => {
        console.error('Error creating Likes table:', err);
});

export default Likes;
