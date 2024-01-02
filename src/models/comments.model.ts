import { DataTypes } from "sequelize"; 
import sequelize from "../config/db";

const Comments = sequelize.define(
   "comments",
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
      content: {
        type: DataTypes.STRING,
        allowNull:true,
      },
      created_at: {
        type: DataTypes.STRING,
        allowNull:false,
      },
      updated_at: {
        type: DataTypes.STRING,
        allowNull:false,
      },
  },
  {

  }
);

Comments.sync().then(() => {}).catch((err: any) => {
        console.error('Error creating Comments table:', err);
});

export default Comments;
