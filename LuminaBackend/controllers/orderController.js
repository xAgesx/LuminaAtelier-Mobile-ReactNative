const Order = require("../models/order_model");
const Cart = require("../models/cart_model");

exports.createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("products.productId");
        
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const orderItems = cart.products.map(item => ({
            product: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            material: item.productId.material,
            image: item.productId.image,
            qty: item.quantity
        }));

        const total = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            total: total,
            paymentMethod: req.body.paymentMethod || "card",
            status: "Processing"
        });

        await Cart.findByIdAndDelete(cart._id);

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
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            message: "Orders fetched",
            data: { orders, count: orders.length }
        });
    } catch (error) {
        res.status(400).json({
            message: "get operation failed",
            error: error.message || error
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
