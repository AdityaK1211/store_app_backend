const express = require("express");
const auth = require("../middleware/auth");
const Order = require("../model/Orders");
const Cart = require("../model/Cart");
const Address = require("../model/Address");

const router = new express.Router();

// Fetch all orders
router.get("/fetch", auth, async(req, res) => {
    try {
        const order = await Order.find({ owner: req.user._id });
        if (!order) {
            return res.status(404).send();
        }
        res.status(200).send(order);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Post request for placing order
router.post("/add", auth, async (req, res) => {
    const owner = req.user._id
    let cart = await Cart.findOne({owner});
    let address = await Address.findOne({owner});

    try {
        let order = await Order.findOne({ owner });
        if (order) {
            order.cart = cart
            order.address = address
            order.amount = cart.amount
            order = await order.save();
            await Cart.findOneAndDelete({owner})
            return res.status(201).send(order);
        } else {
            const newOrder = await Order.create({
                owner,
                cart,
                address,
                amount: cart.amount
            });
            await Cart.findOneAndDelete({owner})
            return res.status(201).send(newOrder);
        }

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;