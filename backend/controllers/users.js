const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// @desc    Authenticate user & get token (Login)
// @route   POST /api/login
// @access  Public
loginRouter.post("/", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ error: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: "Invalid email or password",
      });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    // Sign the token
    const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    response.status(200).send({
      token,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    response
      .status(500)
      .json({ error: "Server error during login", details: error.message });
  }
});

// @desc    Register a new user (Signup)
// @route   POST /api/login/signup
// @access  Public
loginRouter.post("/signup", async (request, response) => {
  try {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      return response
        .status(400)
        .json({ error: "Please provide username, email, and password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ error: "Email is already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json({
      message: "User created successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error) {
    response
      .status(500)
      .json({ error: "Server error during signup", details: error.message });
  }
});

module.exports = loginRouter;
