const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    material: {
        type: String,
        required: [true, "Material is required"]
    },
    type: {
        type: String,
        enum: ["Trending", "New", "Deals"],
        default: "New"
    },
    image: {
        type: String,
        required: [true, "Image URL is required"]
    },
    description: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
