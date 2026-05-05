const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: [validator.isEmail, "Email is incorrect"],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
    },
    lastPasswordChangeDate: {
        type: Date,
        default: Date.now()
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    confirmPassword: {
        type: String,
        required: [true, "Confirm password is required"],
        minlength: 8,
        validate: {
            validator: function (cPass) {
                return cPass === this.password;
            },
            message: "Passwords don't match"
        }
    }
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmPassword = undefined;
    }
    return next; 
});

userSchema.methods.checkPass = async function (hashedPass, pass) {
    return await bcrypt.compare(pass, hashedPass);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
