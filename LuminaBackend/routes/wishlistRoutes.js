const { getWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishlistController");
const express = require("express");
const { protectorMW } = require("../middlewares/authGuard");
const router = express.Router();

router.get("/", protectorMW, getWishlist);
router.post("/add", protectorMW, addToWishlist);
router.post("/remove", protectorMW, removeFromWishlist);

module.exports = router;
