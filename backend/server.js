const express = require("express");
const cropRoutes = require("./routes/cropRoute")
const app = express();

const PORT = 5000;


app.get("/", (req,res)=>{
        res.send("backend is running");
});

app.use(express.json());
app.use("/api/crops",cropRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});