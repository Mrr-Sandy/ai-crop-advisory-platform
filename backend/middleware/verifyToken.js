const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  res.json({
    message: "Verify Token Middleware Working",
  });
};

module.exports = verifyToken;