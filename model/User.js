import { DataTypes } from "sequelize";
import databaseConnection from "../database/database-connection.js";

const User = databaseConnection.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  birthdate: {
    type: DataTypes.DATEONLY,
  },
});

export default User;
