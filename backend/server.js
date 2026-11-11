const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Product = require("./models/Product");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/ecommerce")
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => console.log(err));

// Rota para buscar produtos (com suporte a filtro por categoria)
app.get("/api/products", async (req, res) => {
  const qCategory = req.query.category;
  try {
    let products;
    if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}!`);
});