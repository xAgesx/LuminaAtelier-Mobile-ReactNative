const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            name: String,
            price: Number,
            material: String,
            image: String,
            qty: {
                type: Number,
                default: 1
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Processing", "In Transit", "Delivered", "Cancelled"],
        default: "Processing"
    },
    paymentMethod: {
        type: String,
        enum: ["card", "apple"],
        default: "card"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
