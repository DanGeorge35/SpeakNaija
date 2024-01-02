import { DataTypes } from "sequelize"; 
import sequelize from "../config/db";

const _groups = sequelize.define(
   "_groups",
  {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      group_name: {
        type: DataTypes.STRING,
        allowNull:false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull:true,
      },
      author_id: {
        type: DataTypes.STRING,
        allowNull:false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull:false,
      },
      updated_at: {
        type: DataTypes.STRING,
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

_groups.sync().then(() => {}).catch((err: any) => {
        console.error('Error creating _groups table:', err);
});

export default _groups;
