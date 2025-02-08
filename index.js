import express from "express";
import cors from "cors";
import User from "./model/User.js";
import syncTableDatabase from "./database/sync-table-database.js";
import Order from "./model/Order.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post("/", async (request, response) => {
  const { name, birthdate } = request.body;
  const users = await User.create({ name, birthdate });
  const order = await Order.create({ user_id: users.id });
  return response.status(200).json(`Dados salvos com sucesso`);
});

app.get("/", async (request, response) => {
  const user = request.body;
  //   const users = await User.sync();
  return response.status(200).json(`Os dados a serem salvos são: ${user}`);
});

const initApp = async () => {
  await syncTableDatabase();
  app.listen(port, (error) => {
    if (error) {
      console.error(`App is down: ${error}`);
    }

    console.log("App is running");
  });
};

initApp();
