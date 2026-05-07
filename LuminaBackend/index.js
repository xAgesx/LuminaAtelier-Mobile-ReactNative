const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
const PORT = 4040;

app.use(express.json());
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Connected to Mongoose");
  })
  .catch((error) => {
    console.log("Error while connecting to Mongoose"+error);
  });

app.listen(PORT, () => {
  console.log("Server is running on PORT : ", PORT);
});