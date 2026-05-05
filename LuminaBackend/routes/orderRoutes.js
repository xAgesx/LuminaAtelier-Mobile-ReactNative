const { createOrder, getOrdersByUser, getOrderById, updateOrderStatus } = require("../controllers/orderController");
const express = require("express");
const { protectorMW } = require("../middlewares/authGuard");
const router = express.Router();

router.post("/", protectorMW, createOrder);
router.get("/user/:userId", protectorMW, getOrdersByUser);
router.route("/:id").get(protectorMW, getOrderById).patch(protectorMW, updateOrderStatus);

module.exports = router;
