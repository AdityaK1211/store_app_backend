const express = require("express");
const auth = require("../middleware/auth");
const Cart = require("../model/Cart");
const Product = require("../model/Products");
const router = new express.Router();

// Fetch all cart items
router.get("/fetch", auth, async(req, res) => {
    try {
        const cart = await Cart.find({ owner: req.user._id });
        if (!cart) {
            return res.status(404).send();
        }
        res.status(200).send(cart);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Post request for adding products to cart
router.post("/add/:id", auth, async (req, res) => {
    const product_id = req.params.id
    const owner = req.user._id
    let product = await Product.findOne({product_id});
    let quantity = 1;
    let price = product.price;
    let total = price * quantity;
    let amount = 0;

    try {
        let cart = await Cart.findOne({ owner });
        if (cart) {
            let itemIndex = cart.items.findIndex(p => p.product_id == product_id);
            if (itemIndex > -1) {
                let productItem = cart.items[itemIndex];
                quantity = productItem.quantity + 1;
                amount = cart.amount + price;

                productItem.quantity = quantity;
                productItem.price = price;
                productItem.total = price * quantity
                cart.items[itemIndex] = productItem;
                cart.amount = amount;
            } else {
                amount = cart.amount + price
                cart.items.push({ product_id, quantity, price, total });
                cart.amount = amount
            }
            cart = await cart.save();
            return res.status(201).send(cart);
        } else {
            const newCart = await Cart.create({
                owner,
                items: [{ product_id, quantity, price, total }],
                amount: total
            });

            return res.status(201).send(newCart);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

// Post request to clear cart
router.post("/clear", auth, async (req, res) => {
    const owner = req.user._id

    try {
        let cart = await Cart.findOne({ owner });
        cart.items = [];
        let data = await cart.save();
        res.status(200).json({
            type: "success",
            mgs: "Cart has been emptied",
            data: data
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong",
            err: err
        })
    }
});

// User order checkout
router.get("/checkout", auth, async (req, res) => {
    try {
        const cart = await Cart.find({ owner: req.user._id });
        if (!cart) {
            return res.status(404).send();
        }
        res.status(200).send(cart);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;