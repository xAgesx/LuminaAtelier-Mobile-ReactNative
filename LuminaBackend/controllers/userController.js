const User = require("../models/user_model");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        const nb = users.length;
        res.status(200).json({
            message: "Users fetched",
            data: { users, count: nb }
        });
    } catch (error) {
        res.status(400).json({
            message: "get operation failed",
            error: error
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        res.status(200).json({
            message: "User fetched",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            message: "get operation failed",
            error: error
        });
    }
};

exports.updateUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: "No user found with this ID" });
        }
        res.status(200).json({
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            message: "Update operation failed",
            error: error.message || error
        });
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        res.status(200).json({
            message: "User deleted",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            message: "get operation failed",
            error: error
        });
    }
};
