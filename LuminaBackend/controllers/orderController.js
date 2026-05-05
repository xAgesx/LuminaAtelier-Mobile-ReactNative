const Order = require("../models/order_model");

exports.createOrder = async (req, res) => {
    try {
        const order = await Order.create({ ...req.body, user: req.body.userId });
        res.status(201).json({
            message: "Order placed !!!",
            data: order
        });
    } catch (error) {
        res.status(400).json({
            message: "Order creation failed",
            error: error.message || error
        });
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json({
            message: "Orders fetched",
            data: { orders, count: orders.length }
        });
    } catch (error) {
        res.status(400).json({
            message: "get operation failed",
            error: error
        });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "No order found" });
        }
        res.status(200).json({
            message: "Order fetched",
            data: order
        });
    } catch (error) {
        res.status(400).json({
            message: "get operation failed",
            error: error
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: "No order found" });
        }
        res.status(200).json({
            message: "Order status updated",
            data: order
        });
    } catch (error) {
        res.status(400).json({
            message: "Update operation failed",
            error: error.message || error
        });
    }
};
