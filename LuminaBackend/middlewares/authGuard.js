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
            console.log("Auth: No token provided");
            return res.status(401).json({
                message: "token not found"
            });
        }

        console.log("Auth: Token received, JWT_SECRET:", process.env.JWT_SECRET ? "exists" : "undefined");

        const decoded = await promisify(verify)(token, process.env.JWT_SECRET);
        console.log("Auth: Token decoded:", decoded);

        if (!decoded) {
            console.log("Auth: Token invalid - no decoded data");
            return res.status(401).json({
                message: "Token not valid"
            });
        }

        console.log("Auth: Token decoded, user id:", decoded.id);

        const user = await User.findById(decoded.id);
        if (!user) {
            console.log("Auth: User not found for id:", decoded.id);
            return res.status(401).json({
                message: "user not found"
            });
        }

        req.user = user;
        console.log("Auth: User authenticated:", user.email);
        return next();

    } catch (error) {
        console.log("Auth error catch:", error.message);
        console.log("Auth error stack:", error.stack);
        res.status(400).json({
            message: "operation of protector failed",
            error: error.message
        });
    }
};
