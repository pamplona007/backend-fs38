import { Sequelize } from "sequelize";

const databaseConnection = new Sequelize("shop_dc", "root", "2025db!@iphDev", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  logging: false,
});

const authenticate = async () => {
  try {
    await databaseConnection.authenticate();
    console.log("Database is connected!");
  } catch (error) {
    console.error(error);
  }
};

authenticate();

export default databaseConnection;
