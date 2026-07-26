const express = require("express");
const router = express.Router();
const Crop = require("../models/Crop");
const verifyToken = require("../middleware/verifyToken");

function optionalVerifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next();
    }

    return verifyToken(req, res, next);
}

function getOwnerQuery(req) {
    return req.user?.id ? { owner: req.user.id } : {};
}

router.get("/", optionalVerifyToken, async (req, res) => {
    try {
        const crops = await Crop.find(getOwnerQuery(req));
        res.status(200).json(crops);
    } catch (error) {
        // Return 500 when MongoDB or Mongoose cannot complete the read operation.
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/search", optionalVerifyToken, async (req, res) => {
    try {
        const name = req.query.name || "";

        const result = await Crop.find({
            ...getOwnerQuery(req),
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

router.get("/:id", optionalVerifyToken, async (req, res) => {
    try {
        const crop = await Crop.findOne({
            _id: req.params.id,
            ...getOwnerQuery(req)
        });

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



router.post("/", verifyToken, async (req, res) => {
    try {
        const newCrop = await Crop.create({
            ...req.body,
            owner: req.user.id
        });

        res.status(201).json(newCrop);
    } catch (error) {
        // Return 500 when MongoDB or Mongoose cannot create the crop document.
        res.status(500).json({
            message: error.message
        });
    }
});

router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { owner, ...updates } = req.body;
        const crop = await Crop.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.user.id
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

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

router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const crop = await Crop.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id
        });

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
