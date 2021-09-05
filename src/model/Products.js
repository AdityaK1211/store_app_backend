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
        reviews:  [{
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users"
            },
            username: {
                type: String,
                trim: true
            },
            user_rating: {
                type: Number,
            },
            user_review: {
                type: String,
                trim: true
            },
        }]
    }, { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
