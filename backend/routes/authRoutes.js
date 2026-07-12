const verifyToken = require("../middleware/verifyToken");

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const {
  registerUser,
  loginUser,
  getProfile,
  googleCallback,
} = require("../controllers/authController");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

function requireGoogleConfig(req, res, next) {
  if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_CALLBACK_URL
  ) {
    return res.status(503).json({
      message: "Google OAuth is not configured",
    });
  }

  next();
}

router.post(
  "/register",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .isEmail()
      .withMessage("Enter a valid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);
router.post(
  "/login",
  loginLimiter,
  [
    body("email")
      .isEmail()
      .withMessage("Enter a valid email"),
    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  loginUser
);
router.get("/profile", verifyToken, getProfile);
router.get(
  "/google",
  requireGoogleConfig,
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);
router.get(
  "/google/callback",
  requireGoogleConfig,
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=Google%20login%20failed`,
    session: false,
  }),
  googleCallback
);

module.exports = router;
