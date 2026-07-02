const express = require("express");
const cors = require("cors");
const cropRoutes = require("./routes/cropRoute")
const app = express();

const PORT = process.env.PORT || 5000;


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
