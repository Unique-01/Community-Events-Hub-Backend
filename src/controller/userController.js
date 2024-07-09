const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
        return res.status(400).send({ error: "User is Already Registered" });
    }

    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const isPasswordMatch = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (isPasswordMatch) {
                const token = await user.generateAuthToken();
                return res.send({ user, token });
            }
        }
        res.status(400).send({ error: "Invalid Credentials" });
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = { registerUser, loginUser };
