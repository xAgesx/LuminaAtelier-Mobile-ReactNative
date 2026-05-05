const User = require("../models/user_model");
const jwt = require("jsonwebtoken");

const createToken = (id, name) => {
    return jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

exports.signup = async (req, res) => {
    try {
        if (req.body.role === "admin") {
            req.body.role = "user";
        }
        const user = await User.create({ ...req.body });
        const token = createToken(user._id, user.name);
        res.status(201).json({
            message: "user created !!!",
            data: { user, token }
        });
    } catch (error) {
        res.status(400).json({
            message: "Creation failed" + error,
            error: error.message || error
        });
    }
};

exports.login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                message: "Email and Password are required"
            });
        }
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({
                message: "Email or Password is incorrect"
            });
        }
        if (!await user.checkPass(user.password, req.body.password)) {
            return res.status(400).json({
                message: "Email or Password invalid"
            });
        }
        const token = createToken(user._id, user.name);
        res.status(200).json({
            message: "user logged in successfully !!!",
            data: { user, token }
        });
    } catch (error) {
        res.status(400).json({
            message: "Login failed",
            error: error.message || error
        });
    }
};
