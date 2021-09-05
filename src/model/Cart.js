const mongoose = require("mongoose");

const itemSchema = mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity can not be less then 1.']
        },
        price: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true,
        },
    }, { timestamps: true }
);

const cartSchema = mongoose.Schema(
    {
        active: {
            type: Boolean,
            default: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Users"
        },
        items: [itemSchema],
        amount: {
            type: Number,
            required: true,
        },
    }, { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
