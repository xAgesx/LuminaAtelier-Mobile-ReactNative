const { signup, login } = require("../controllers/authUser");
const { getAllUsers, getUserById, deleteUserById, updateUserById } = require("../controllers/userController");
const express = require("express");
const { protectorMW } = require("../middlewares/authGuard");
const router = express.Router();

router.route("/").post(signup);
router.get("/getAllUsers", protectorMW, getAllUsers);
router.route("/:id").get(getUserById).delete(deleteUserById).patch(updateUserById);
router.post("/login", login);

module.exports = router;
