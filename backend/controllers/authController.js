const registerUser = async (req, res) => {
  res.json({
    message: "Register API Working",
  });
};

const loginUser = async (req, res) => {
  res.json({
    message: "Login API Working",
  });
};

module.exports = {
  registerUser,
  loginUser,
};