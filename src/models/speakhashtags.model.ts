import { DataTypes } from "sequelize"; 
import sequelize from "../config/db";

const Speakhashtags = sequelize.define(
   "speakhashtags",
  {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      speak_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      hashtag_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
  },
  {

  }
);

Speakhashtags.sync().then(() => {}).catch((err: any) => {
        console.error('Error creating Speakhashtags table:', err);
});

export default Speakhashtags;
