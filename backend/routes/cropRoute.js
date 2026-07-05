const express = require("express");
const router = express.Router();
const Crop = require("../models/Crop");


router.get("/", async (req, res) => {
    try {
        // Fetch every crop from MongoDB instead of reading from the old in-memory array.
        const crops = await Crop.find();
        res.status(200).json(crops);
    } catch (error) {
        // Return 500 when MongoDB or Mongoose cannot complete the read operation.
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/search", async (req, res) => {
    try {
        const name = req.query.name || "";

        // Use a MongoDB case-insensitive regex query instead of filtering the old local array.
        const result = await Crop.find({
            name: {
                $regex: name,
                $options: "i"
            }
        });

        res.status(200).json(result);
    } catch (error) {
        // Return 500 when the search query fails while reading from MongoDB.
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        // Look up the crop by its MongoDB document id instead of a numeric array id.
        const crop = await Crop.findById(req.params.id);

        if (!crop) {
            return res.status(404).json({
                message: "crop not found"
            });
        }

        res.status(200).json(crop);
    } catch (error) {
        // Return 404 for invalid MongoDB ids because no matching crop document can be found.
        if (error.name === "CastError") {
            return res.status(404).json({
                message: "crop not found"
            });
        }

        // Return 500 for any other database or server failure.
        res.status(500).json({
            message: error.message
        });
    }
});



router.post("/", async (req, res) => {
    try {
        // Create and save a new MongoDB document instead of pushing into the old local array.
        const newCrop = await Crop.create(req.body);

        res.status(201).json(newCrop);
    } catch (error) {
        // Return 500 when MongoDB or Mongoose cannot create the crop document.
        res.status(500).json({
            message: error.message
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        // Update the MongoDB document by id and return the updated version to match the old API behavior.
        const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!crop) {
            return res.status(404).json({
                message: "Crop not found"
            });
        }

        res.status(200).json(crop);
    } catch (error) {
        // Return 404 for invalid MongoDB ids because no matching crop document can be updated.
        if (error.name === "CastError") {
            return res.status(404).json({
                message: "Crop not found"
            });
        }

        // Return 500 for validation, database, or server failures during update.
        res.status(500).json({
            message: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        // Delete the MongoDB document by id instead of removing an item from the old local array.
        const crop = await Crop.findByIdAndDelete(req.params.id);

        if (!crop) {
            return res.status(404).json({
                message: "Crop not found"
            });
        }

        res.status(204).send();
    } catch (error) {
        // Return 404 for invalid MongoDB ids because no matching crop document can be deleted.
        if (error.name === "CastError") {
            return res.status(404).json({
                message: "Crop not found"
            });
        }

        // Return 500 for any other database or server failure during delete.
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
