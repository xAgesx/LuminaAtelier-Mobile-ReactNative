const Cart = require("../models/cart_model");

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("products.productId");
        if (!cart) {
            return res.status(200).json({ message: "Cart is empty", data: { products: [] } });
        }
        res.status(200).json({
            message: "Cart fetched",
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            message: "get cart failed",
            error: error.message
        });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            cart = await Cart.create({ 
                user: req.user._id, 
                products: [{ productId, quantity }] 
            });
        } else {
            const existingProduct = cart.products.find(p => p.productId.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
            await cart.save();
        }
        
        const populatedCart = await Cart.findById(cart._id).populate("products.productId");
        res.status(200).json({
            message: "Product added to cart",
            data: populatedCart
        });
    } catch (error) {
        res.status(400).json({
            message: "add to cart failed",
            error: error.message
        });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not in cart" });
        }
        
        if (quantity <= 0) {
            cart.products.splice(productIndex, 1);
        } else {
            cart.products[productIndex].quantity = quantity;
        }
        
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate("products.productId");
        
        res.status(200).json({
            message: "Cart updated",
            data: populatedCart
        });
    } catch (error) {
        res.status(400).json({
            message: "update cart failed",
            error: error.message
        });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        await cart.save();
        
        const populatedCart = await Cart.findById(cart._id).populate("products.productId");
        res.status(200).json({
            message: "Product removed from cart",
            data: populatedCart
        });
    } catch (error) {
        res.status(400).json({
            message: "remove from cart failed",
            error: error.message
        });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ user: req.user._id });
        res.status(200).json({
            message: "Cart cleared",
            data: null
        });
    } catch (error) {
        res.status(400).json({
            message: "clear cart failed",
            error: error.message
        });
    }
};