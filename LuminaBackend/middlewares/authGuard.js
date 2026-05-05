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
            return res.status(401).json({
                message: "token not found"
            });
        }

        const decoded = await promisify(verify)(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                message: "Token not valid"
            });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                message: "user not found"
            });
        }

        if (decoded.iat < User.lastPasswordChangeDate) {
            return res.status(400).json({
                message: "Token is invalid"
            });
        }

        req.user = user;
        return next();

    } catch (error) {
        res.status(400).json({
            message: "operation of protector failed",
            error: error.message
        });
    }
};
