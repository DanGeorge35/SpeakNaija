import { DataTypes } from "sequelize"; 
import sequelize from "../config/db";

const Followers = sequelize.define(
   "followers",
  {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      following_id: {
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

Followers.sync().then(() => {}).catch((err: any) => {
        console.error('Error creating Followers table:', err);
});

export default Followers;
