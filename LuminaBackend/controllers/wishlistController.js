const Wishlist = require("../models/wishlist_model");

exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.params.userId }).populate("products");
        if (!wishlist) {
            return res.status(200).json({ message: "Wishlist is empty", data: { products: [] } });
        }
        res.status(200).json({
            message: "Wishlist fetched",
            data: wishlist
        });
    } catch (error) {
        res.status(400).json({
            message: "get operation failed",
            error: error
        });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, products: [productId] });
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
                await wishlist.save();
            }
        }
        res.status(200).json({
            message: "Product added to wishlist",
            data: wishlist
        });
    } catch (error) {
        res.status(400).json({
            message: "add to wishlist failed",
            error: error
        });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }
        wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
        await wishlist.save();
        res.status(200).json({
            message: "Product removed from wishlist",
            data: wishlist
        });
    } catch (error) {
        res.status(400).json({
            message: "remove from wishlist failed",
            error: error
        });
    }
};
