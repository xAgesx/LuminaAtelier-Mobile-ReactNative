const { verify } = require("jsonwebtoken");
const User = require("../models/user_model");
const { promisify } = require("util");

exports.protectorMW = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            console.log("⚠️ Auth: No token provided");
            return res.status(401).json({
                message: "token not found"
            });
        }

        const decoded = await promisify(verify)(token, process.env.JWT_SECRET);
        if (!decoded) {
            console.log("⚠️ Auth: Token invalid");
            return res.status(401).json({
                message: "Token not valid"
            });
        }

        console.log("⚠️ Auth: Token decoded, user id:", decoded.id);

        const user = await User.findById(decoded.id);
        if (!user) {
            console.log("⚠️ Auth: User not found for id:", decoded.id);
            return res.status(401).json({
                message: "user not found"
            });
        }

        req.user = user;
        console.log("⚠️ Auth: User authenticated:", user.email);
        return next();

    } catch (error) {
        console.log("⚠️ Auth error:", error.message);
        res.status(400).json({
            message: "operation of protector failed",
            error: error.message
        });
    }
};
