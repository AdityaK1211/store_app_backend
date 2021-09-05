const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Users"
        },
        cart: {
            type: Object,
            required: true
        },
        address: {
            type: Object,
            required: true
        },
        amount: {
            type: Number,
            required: true,
        },
    }, { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
