const { getAllProducts, getProductById, createProduct, updateProductById, deleteProductById } = require("../controllers/productController");
const express = require("express");
const { protectorMW } = require("../middlewares/authGuard");
const router = express.Router();

router.route("/").get(getAllProducts).post(protectorMW, createProduct);
router.route("/:id").get(getProductById).patch(protectorMW, updateProductById).delete(protectorMW, deleteProductById);

module.exports = router;
