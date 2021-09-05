const express = require("express");
const Message = require("../model/Messages");
const auth = require("../middleware/auth");
const router = new express.Router();

router.get("/", (req,res) => {
    res.send("Hey");
});

router.post("/send", auth, async (req,res) =>{
    try{
        if (req.user._id.toString() === req.body.receiver) {
            res.status(404).send("Same User can't send message");
        } else {
            const message = new Message({
                ...req.body,
                sender: req.user._id
            });
            await message.save();
            res.status(201).send(message);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/sent", auth, async (req, res) => {
    try{
        const message = await Message.find({
            sender: req.user._id
        });
        res.status(201).send(message);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/receive", auth, async (req, res) => {
    try{
        const message = await Message.find({
            receiver: req.user._id
        });
        res.status(201).send(message);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/conversation/:id", auth, async (req,res) =>{
    try {
        const message = await Message.find({});
        let received = [];
        let sent = [];
        await message.map((item) => {
            if (item.sender.toString() === req.params.id && item.receiver.toString() === req.user._id.toString()) {
                received.push(item)
            }
            if (item.sender.toString() === req.user._id.toString() && item.receiver.toString() === req.params.id) {
                sent.push(item)
            }
        })
        const finalConversation = {
            received: received,
            sent: sent
        }
        res.status(201).send(finalConversation);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete("/delete/:id", auth, async (req,res) => {
    const message = await Message.find({});
    let final = {};
    await message.map(async (item) => {
        if ((item.sender.toString() === req.params.id && item.receiver.toString() === req.user._id.toString()) || (item.sender.toString() === req.user._id.toString() && item.receiver.toString() === req.params.id)) {
            console.log(item._id);
            final = await Message.findOneAndDelete({_id: item._id})
        }
    })
    res.send(final);
})

module.exports = router;
