import Order from "../model/Order.js";
import User from "../model/User.js";

const syncTableDatabase = async () => {
  await User.sync({ force: false });
  await Order.sync({ force: false });
};

export default syncTableDatabase;
