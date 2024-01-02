import { DataTypes } from "sequelize"; 
import sequelize from "../config/db";

const Groupmembers = sequelize.define(
   "groupmembers",
  {
      group_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      is_admin: {
        type: DataTypes.STRING,
        allowNull:false,
      },
  },
  {

  }
);

Groupmembers.sync().then(() => {}).catch((err: any) => {
        console.error('Error creating Groupmembers table:', err);
});

export default Groupmembers;
