require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cropRoutes = require("./routes/cropRoute");

const app = express();


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


app.get("/", (req,res)=>{
        res.send("backend is running");
});

app.use(cors());
app.use(express.json());
app.use("/api/crops",cropRoutes);

if (require.main === module) {
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
