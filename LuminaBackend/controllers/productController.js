const Product = require("../models/product_model");

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            message: "Products fetched",
            data: { products, count: products.length }
        });
    } catch (error) {
        res.status(400).json({
            message: "get operation failed",
            error: error
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "No product found" });
        }
        res.status(200).json({
            message: "Product fetched",
            data: product
        });
    } catch (error) {
        res.status(400).json({
            message: "get operation failed",
            error: error
        });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            message: "Product created",
            data: product
        });
    } catch (error) {
        res.status(400).json({
            message: "Creation failed",
            error: error.message || error
        });
    }
};

exports.updateProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ message: "No product found" });
        }
        res.status(200).json({
            message: "Product updated",
            data: product
        });
    } catch (error) {
        res.status(400).json({
            message: "Update operation failed",
            error: error.message || error
        });
    }
};

exports.deleteProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "No product found" });
        }
        res.status(200).json({
            message: "Product deleted",
            data: product
        });
    } catch (error) {
        res.status(400).json({
            message: "delete operation failed",
            error: error
        });
    }
};
