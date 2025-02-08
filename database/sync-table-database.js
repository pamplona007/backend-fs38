import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import databaseConnection from "./database-connection.js";

const syncTableDatabase = async () => {
  databaseConnection.sync({ force: false });
};

export default syncTableDatabase;
