import { DataTypes } from "sequelize";
import databaseConnection from "../database/database-connection.js";
import User from "./User.js";

const Order = databaseConnection.define("order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

Order.belongsTo(User, {
  foreignKey: {
    name: "user_id",
  },
});

export default Order;
