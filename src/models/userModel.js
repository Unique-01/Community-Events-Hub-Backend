const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_KEY = process.env.JWT_KEY;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        validate(value) {
            if (value == "password" || value == "Password") {
                throw new Error("Password Value cannot be 'password' ");
            }
        },
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

UserSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    next();
});

UserSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, JWT_KEY);
    user.tokens = user.tokens.concat({ token });

    await user.save();
    return token;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
