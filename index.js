import express, { request, response } from "express";
import cors from "cors";
import syncTableDatabase from "./database/sync-table-database.js";
import Product from "./model/Product.js";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;

const secretKey =
  "432rewlfds@#$rdjshdkjdshfkjdsfs#$%%$xcmvnfldsjfo#@$#%#$RFDFD*8tgdfvcjdkjkdw";

app.use(cors());
app.use(express.json());

app.get("/jwt", (request, response) => {
  const jwtToken = jwt.sign(
    {
      data: "gideaoferreira@hotmail.com",
    },
    secretKey
  );
  return response.json(jwtToken);
});

app.get("/jwt-verify/:token", (request, response) => {
  const token = request.params.token;
  const jwtToken = jwt.verify(token, secretKey);

  return response.json(jwtToken);
});

app.post("/login", (request, response) => {
  const { password, email } = request.body;

  if (!password || !email) {
    return response.json("User not fund", 422);
  }

  const jwtToken = jwt.sign(email, secretKey);
  return response.json(jwtToken, 200);
});

/**
 * Cria um produto
 */
app.post("/product", async (request, response) => {
  try {
    const { name, brand, description } = request.body;
    const product = await Product.create({ name, brand, description });
    return response
      .status(200)
      .json({ message: `Produto cadastrado com sucesso`, data: product });
  } catch (error) {
    return response
      .status(500)
      .json(`Não foi possível cadastrar o produto ${error.message}`);
  }
});

const authMiddleware = (request, response, next) => {
  try {
    const jwtToken = request.headers;
    console.log("Auth: ", jwtToken);
    //   if (!jwtToken) {
    //     return response.json("Unauthorized", 403);
    //   }

    //   jwt.verify(jwtToken, secretKey);
    next();
  } catch (error) {
    return response.json(`Unauthorized. Error: ${error.message}`, 401);
  }
};

/**
 * Retorna a lista de produtos
 */
app.get("/products", authMiddleware, async (request, response) => {
  try {
    const products = await Product.findAll();
    return response.status(200).json(products);
  } catch (error) {
    return response.status(500).json(error.message);
  }
});

app.put("/product/:id", async (request, response) => {
  const productId = request.params.id;
  const productName = request.body.name;
  const product = await Product.findOne({ where: { id: productId } });
  product.set({
    name: productName,
  });

  await product.save();
  return response.status(200).json(product);
});

/**
 * Deleta um produto
 */
app.delete("/product/:id", async (request, response) => {
  try {
    const productId = request.params.id;
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      return response.status(422).json(`Produto não encontrado`);
    }
    await Product.destroy({ where: { id: productId } });
    return response.status(200).json(`Produto deletado com sucesso`);
  } catch (error) {
    return response
      .status(500)
      .json(`Não foi possível deletar o produto: ${error.message}`);
  }
});

app.get("/product/:id", async (request, response) => {
  const productId = request.params.id;
  const product = await Product.findByPk(productId);
  return response.status(200).json(product);
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
