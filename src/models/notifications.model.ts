import { DataTypes } from "sequelize"; 
import sequelize from "../config/db";

const Notifications = sequelize.define(
   "notifications",
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
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      speak_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      notification_type: {
        type: DataTypes.STRING,
        allowNull:false,
      },
      created_at: {
        type: DataTypes.STRING,
        allowNull:false,
      },
      is_read: {
        type: DataTypes.STRING,
        allowNull:false,
      },
  },
  {

  }
);

Notifications.sync().then(() => {}).catch((err: any) => {
        console.error('Error creating Notifications table:', err);
});

export default Notifications;
