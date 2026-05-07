const Wishlist = require("../models/wishlist_model");

exports.getWishlist = async (req, res) => {
    try {
        console.log("💚 getWishlist: userId =", req.user._id);
        const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
        console.log("💚 getWishlist: found =", wishlist ? "yes" : "no");
        if (!wishlist) {
            return res.status(200).json({ message: "Wishlist is empty", data: { products: [] } });
        }
        res.status(200).json({
            message: "Wishlist fetched",
            data: wishlist
        });
    } catch (error) {
        console.log("💚 getWishlist: error =", error.message);
        res.status(400).json({
            message: "get operation failed",
            error: error.message
        });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        console.log("💚 addToWishlist: productId =", productId);
        console.log("💚 addToWishlist: userId =", req.user._id);
        
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        console.log("💚 addToWishlist: existing wishlist =", wishlist ? "yes" : "no");
        
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
            console.log("💚 addToWishlist: created new wishlist");
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
                await wishlist.save();
                console.log("💚 addToWishlist: added product");
            } else {
                console.log("💚 addToWishlist: product already in wishlist");
            }
        }
        const populatedWishlist = await Wishlist.findById(wishlist._id).populate("products");
        res.status(200).json({
            message: "Product added to wishlist",
            data: populatedWishlist
        });
    } catch (error) {
        console.log("💚 addToWishlist: error =", error.message);
        res.status(400).json({
            message: "add to wishlist failed",
            error: error.message
        });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }
        wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
        await wishlist.save();
        const populatedWishlist = await Wishlist.findById(wishlist._id).populate("products");
        res.status(200).json({
            message: "Product removed from wishlist",
            data: populatedWishlist
        });
    } catch (error) {
        res.status(400).json({
            message: "remove from wishlist failed",
            error: error.message
        });
    }
};
