const express = require("express");
const auth = require("../middleware/auth");
const Address = require("../model/Address");
const router = new express.Router();

// Fetch all address
router.get("/fetch", auth, async(req, res) => {
    try {
        const address = await Address.find({ owner: req.user._id });
        if (!address) {
            return res.status(404).send();
        }
        res.status(200).send(address);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Post request for adding address
router.post("/add", auth, async (req, res) => {
    const owner = req.user._id

    try {
        const address = new Address({
            ...req.body,
            owner
        });
        await address.save();
        res.status(201).send(address);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

// Post request to delete address
router.post("/delete/:id", auth, async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!address) {
            return res.status(404).send();
        }
        res.send(address);
    } catch (e) {
        return res.status(500).send(e);
    }
});

module.exports = router;