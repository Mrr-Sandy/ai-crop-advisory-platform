const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cropRoutes = require("./routes/cropRoute");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const configurePassport = require("./config/passport");
const app = express();


const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL;
const isProduction = process.env.NODE_ENV === "production";

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (CLIENT_URL && origin === CLIENT_URL) {
    return true;
  }

  return !isProduction && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

configurePassport();

app.get("/", (req,res)=>{
        res.send("backend is running");
});

app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/crops",cropRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

if (require.main === module) {
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
