const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function sanitizeUser(user) {
  const userObject = user.toObject ? user.toObject() : user;
  delete userObject.password;
  return userObject;
}

function getValidationMessage(req) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return null;
  }

  return errors.array().map((error) => error.msg).join(", ");
}

const registerUser = async (req, res) => {
  try {
    const validationMessage = getValidationMessage(req);

    if (validationMessage) {
      return res.status(400).json({
        message: validationMessage,
      });
    }

    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      authProvider: "local",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: sanitizeUser(user),
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const validationMessage = getValidationMessage(req);

    if (validationMessage) {
      return res.status(400).json({
        message: validationMessage,
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || !user.password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const googleCallback = (req, res) => {
  try {
    const token = createToken(req.user);
    const clientUrl = process.env.CLIENT_URL;

    res.redirect(`${clientUrl}/login?token=${encodeURIComponent(token)}`);
  } catch {
    const clientUrl = process.env.CLIENT_URL;
    res.redirect(`${clientUrl}/login?error=${encodeURIComponent("Google login failed")}`);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  googleCallback,
  createToken,
};
