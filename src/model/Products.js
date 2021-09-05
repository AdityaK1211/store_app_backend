const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Users"
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        sub_title: {
            type: String,
            required: true,
            trim: true,
        },
        images: [{
            url: {
                type: String,
            },
        }],
        price: {
            type: Number,
            required: true
        },
        old_price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        rating: {
            type: Number,
            trim: true
        },
        reviews:  [{
            rating: {
                type: Number,
                trim: true
            },
            review: {
                type: String,
                trim: true
            },
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Users"
            }
        }]
    }, { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
