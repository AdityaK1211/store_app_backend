const mongoose = require("mongoose");

const addressSchema = mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Users"
        },
        address: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        address2: {
            type: String
        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            maxLength: 6,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        address_type: {
            type: String,
            require: true
        }
    }, { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
