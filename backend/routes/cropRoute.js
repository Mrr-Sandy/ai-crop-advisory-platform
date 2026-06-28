const express = require("express");
const router = express.Router();

const crops = require("../data/crops");


router.get("/", (req,res)=>{
    res.status(200).json(crops);
});
router.get("/search", (req, res) => {
    const name = req.query.name;

    const result = crops.filter(c =>
        c.name.toLowerCase().includes(name.toLowerCase())
    );

    res.status(200).json(result);
});

router.get("/:id",(req,res)=>{
    const id = parseInt(req.params.id);

    const crop  = crops.find(c => c.id === id);

    if(!crop){
        return res.status(404).json({
            message:"crop not found"
        });
    }

    res.status(200).json(crop);
});



router.post("/", (req, res) => {
    const newCrop = {
        id: crops.length + 1,
        ...req.body
    };

    crops.push(newCrop);

    res.status(201).json(newCrop);
});

router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const crop = crops.find(c => c.id === id);

    if (!crop) {
        return res.status(404).json({
            message: "Crop not found"
        });
    }

    Object.assign(crop, req.body);

    res.status(200).json(crop);
});

router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = crops.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Crop not found"
        });
    }

    crops.splice(index, 1);

    res.status(204).send();
});

module.exports = router;