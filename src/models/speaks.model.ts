import { DataTypes } from "sequelize"; 
import sequelize from "../config/db";

const Speaks = sequelize.define(
   "speaks",
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
      content: {
        type: DataTypes.STRING,
        allowNull:true,
      },
      media_url: {
        type: DataTypes.STRING,
        allowNull:false,
      },
      respeak_count: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      like_count: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      comment_count: {
        type: DataTypes.INTEGER,
        allowNull:false,
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

Speaks.sync().then(() => {}).catch((err: any) => {
        console.error('Error creating Speaks table:', err);
});

export default Speaks;
