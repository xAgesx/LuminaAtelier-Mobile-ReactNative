const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../controllers/cartController");
const express = require("express");
const { protectorMW } = require("../middlewares/authGuard");
const router = express.Router();

router.get("/", protectorMW, getCart);
router.post("/add", protectorMW, addToCart);
router.post("/update", protectorMW, updateCartItem);
router.delete("/:productId", protectorMW, removeFromCart);
router.delete("/clear/all", protectorMW, clearCart);

module.exports = router;