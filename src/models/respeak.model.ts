import { DataTypes } from "sequelize"; 
import sequelize from "../config/db";

const Respeak = sequelize.define(
   "respeak",
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

Respeak.sync().then(() => {}).catch((err: any) => {
        console.error('Error creating Respeak table:', err);
});

export default Respeak;
