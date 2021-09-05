const express = require("express");
const User = require("../model/Users");
const auth = require("../middleware/auth");
const {validateEmail, validatePhone} = require("../constants/common");
const {registration_otp} = require("../sms/send_sms");
const {registration_otp_email} = require("../email/send_email");
const router = new express.Router();

// Testing Get Router
// router.get('/', async (req, res) => {
//     res.status(201).send('Hello User');
// });

// Post request for user signup
router.post("/signup", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        console.log('User', user)
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Post request for user login
router.post("/login", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["notification_token", "phone", "password"];
    const isValid = updates.every((update) => allowUpdates.includes(update));

    if (!isValid) {
        return res.status(400).send({ error: "No such property to update" });
    }

    try {
        const user = await User.findByCredentials(
            req.body.phone,
            req.body.password
        );
        // auth token
        updates.forEach((update) => {
            if(update === "notification_token") {
                user[update] = req.body[update];
            }
        });
        await user.save();
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send({ e: e.message });
    }
});

// Post request for user logout
router.post("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.status(200).send("Logout Success");
    } catch (e) {
        res.status(500).send(e);
    }
});

//Fetch owner with token
router.get("/owner", auth, async (req, res) => {
    try{
        const user = await User.findOne({_id: req.user._id});
        res.status(200).send(user);
    }catch (e) {
        res.status(500).send(e);
    }
});

// User forget password otp generation
router.post("/forget_password", async (req, res) => {
    try {
        const user = await User.findOne({ phone: req.body.phone });
        if (!user) {
            return res.status(404).send();
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        if (validateEmail(req.body.phone)) {
            // send_sms_email(user.username, user.phone, otp);
            res.status(201).send({ user, otp });
        }
        else if (validatePhone(req.body.phone)) {
            // send_sms(user.username, user.phone, otp);
            res.status(201).send({ user, otp });
        }
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

// User change password otp generation
router.post("/change_password", async (req, res) => {
    try {
        const user = await User.findOne({ phone: req.body.phone });
        console.log(user.phone);
        if (!user) {
            return res.status(404).send();
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        if (validateEmail(user.phone)) {
            // change_password_send_sms_email(user.username, user.phone, otp)
            res.status(201).send({ user, otp });
        } else if (validatePhone(user.phone)){
            // change_password_send_sms(user.username, user.phone, otp);
            res.status(201).send({ user, otp });
        } else {

        }
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

// Update user password
router.patch("/update_password/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["password"];
    const isValid = updates.every((update) => allowUpdates.includes(update));

    if (!isValid) {
        return res.status(400).send({ error: "No such property to update" });
    }

    try {
        const user = await User.findOne({
            _id: req.params.id
        });
        if (!user) {
            return res.status(404).send();
        }
        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

// User registration otp generation
router.post("/register_OTP", async (req,res) => {
    try {
        const user = await User.findOne({phone: req.body.phone} );
        if ( user ) {
            throw new Error("User already registered")
        } else {
            const otp = Math.floor(1000 + Math.random() * 9000);
            if (validateEmail(req.body.phone)) {
                registration_otp_email(req.body.username, req.body.phone, otp);
                res.status(201).send({otp});
            }
            else if (validatePhone(req.body.phone)) {
                registration_otp(req.body.username, req.body.phone, otp);
                res.status(201).send({otp});
            } else {
                res.status(400).send({e: "Invalid Details"});
            }
        }
    } catch (e) {
        res.status(500).send({e: e.message});
    }
});

// Report abuse user
router.get("/report/:id/:message", auth, async (req,res) => {
    try{
        const user = await User.findOne({
            _id: req.params.id
        });
        // send_report_user_email(user,req.user._id, req.params.message)
        res.status(200).send(user);
    }catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
