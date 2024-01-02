import { DataTypes } from "sequelize"; 
import sequelize from "../config/db";

const Messages = sequelize.define(
   "messages",
  {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      receiver_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull:true,
      },
      is_read: {
        type: DataTypes.STRING,
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

Messages.sync().then(() => {}).catch((err: any) => {
        console.error('Error creating Messages table:', err);
});

export default Messages;
