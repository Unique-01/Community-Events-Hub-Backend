const express = require("express");
const { registerUser, loginUser } = require("../controller/userController");

const router = express.Router();

router.post("/users", registerUser);
router.post("/users/login", loginUser);

module.exports = router;
