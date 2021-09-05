const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
    {
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Users"
        },
        receiver:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        message_data:{
            type: String,
            required: true
        },
    }, { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
