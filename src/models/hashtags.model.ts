import { DataTypes } from "sequelize"; 
import sequelize from "../config/db";

const Hashtags = sequelize.define(
   "hashtags",
  {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      hashtag_name: {
        type: DataTypes.STRING,
        allowNull:false,
      },
  },
  {

  }
);

Hashtags.sync().then(() => {}).catch((err: any) => {
        console.error('Error creating Hashtags table:', err);
});

export default Hashtags;
