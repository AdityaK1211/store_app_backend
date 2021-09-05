const express = require("express");
const User = require("../model/Users");
const Product = require("../model/Products");
const auth = require("../middleware/auth");
const router = new express.Router();
const {product_images, s3} = require("../middleware/upload");

// const upload = multer({
//     dest: 'images'
// })
//
// router.post('/upload', upload.single('upload'), async (req, res) => {
//     res.send()
// });

const resHandler = (filename) => {
    const data = {
        url : filename
    }
    return data;
}

// Post request to add products
router.post("/add", [auth, product_images.array("image")], async (req,res) => {
    try {
        if (req.files === undefined ){
            res.send("undefined");
        } else {
            let fullPath = [];
            req.files.map((item) => {
                const data = resHandler(item.location);
                fullPath.push(data);
            })
            const product = new Product({
                ...req.body,
                images:fullPath,
                owner: req.user._id
            });
            await product.save();
            res.status(201).send(product);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

// Fetch all products
router.get("/fetch", async(req,res) => {
    try {
        const product = await Product.find({});
        if (!product) {
            return res.status(404).send();
        }
        res.status(200).send(product);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Patch request to update product
router.patch("/update/:id", [auth, product_images.array("image")], async (req,res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = [
        "title",
        "sub_title",
        "description",
        "price",
        "old_price",
        "category",
        "images",
    ];
    const isValid = updates.every((update) => allowUpdates.includes(update));
    if (!isValid) {
        return res.status(400).send({ error: "No such property to update" });
    }
    try{
        const product = await Product.findOne({
            _id: req.params.id,
            owner: req.user._id
        });
        if (!product) {
            return res.status(404).send("No such listing");
        } else {
            updates.forEach((update) => {
                if(update === "images") {
                    product.images.map((item) => {
                        const str = item.url;
                        const res = str.split("/");
                        s3.deleteObject({
                            Bucket: process.env.BUCKET_NAME,
                            Key: res[res.length - 2] + "/" + res[res.length - 1]
                        }, function (err,data){});
                    });
                }
            });
        }
        updates.forEach((update) => {
            if(update === "images")
            {
                let fullPath = [];
                req.files.map((item) => {
                    const data = resHandler(item.location);
                    fullPath.push(data);
                })
                product[update] = fullPath;
            }else {
                product[update] = req.body[update]
            }
        });
        await product.save();
        res.status(201).send(product);
    }catch (err) {
        res.status(400).send(err);
    }
});

//Fetch user's products
router.get("/fetch_user_products", auth, async (req, res) => {
    try {
        const product = await Product.find({ owner: req.user._id });
        if (!product) {
            return res.status(404).send();
        }
        res.status(200).send(product);
    } catch (e) {
        res.status(500).send(e);
    }
});

//Delete user's products
router.delete("/delete/:id", auth, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });
        product.images.map((item) => {
            const str = item.url;
            const res = str.split("/");
            s3.deleteObject({
                Bucket: process.env.BUCKET_NAME,
                Key: res[res.length - 2] + "/" + res[res.length - 1]
            },function (err, data){});
        });
        if (!product) {
            return res.status(404).send();
        }
        res.send(product);
    } catch (e) {
        return res.status(500).send(e);
    }
});

// Post request to add product to user wishlist
router.post("/add_to_wishlist/:id", auth, async (req, res) => {
    const product_id = req.params.id

    try {
        let user = await User.findOne({_id: req.user._id});
        let itemIndex = -1;
        user.wishlist.map((item, index) => {
            if (item._id == product_id) {
                itemIndex = index
            }
        })
        if (itemIndex > -1) {
            user.wishlist.push(product_id)
            user = await user.save()
            return res.status(200).send(user)
        }
        else {
            return res.status(400).send('Product already in wishlist!')
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

// Post request to delete product to user wishlist
router.post("/delete_from_wishlist/:id", auth, async (req, res) => {
    const product_id = req.params.id

    try {
        let user = await User.findOne({_id: req.user._id});
        let itemIndex = -1;
        user.wishlist.map((item, index) => {
            if (item._id == product_id) {
                itemIndex = index
            }
        })

        if (itemIndex > -1) {
            user.wishlist.splice(itemIndex, 1);
            user = await user.save()
            return res.status(200).send(user)
        }
        else {
            return res.status(400).send('Product not found in wishlist!')
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

// Post request to clear wishlist
router.post("/clear_wishlist", auth, async (req, res) => {
    try {
        let user = await User.findOne({_id: req.user._id});
        user.wishlist = [];
        user = await user.save();
        res.status(200).send(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            type: "Invalid",
            msg: "Something went wrong",
            err: err
        })
    }
});

// Post request for adding reviews
router.post("/add_review/:id", auth, async (req, res) => {
    const product_id = req.params.id
    const user_id = req.user._id
    const user_rating = req.body.rating
    const user_review = req.body.review
    let rating = 0

    try {
        let user = await User.findOne({_id: req.user._id});
        const username = user.username
        let product = await Product.findOne({_id: product_id});
        if (product) {
            let itemIndex = product.reviews.findIndex(p => p.user_id == user_id);
            if (itemIndex > -1) {
                let productItem = product.reviews[itemIndex];
                productItem.user_review = user_review
                productItem.user_rating = user_rating
                product.reviews[itemIndex] = productItem;
            }
            else {
                product.reviews.push({
                    user_id,
                    username,
                    user_rating,
                    user_review
                })
            }
            product = await product.save()
            return res.status(200).send(product)
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

// Report abuse product
router.get("/report/:id/:message", auth, async (req,res) => {
    try{
        const product = await Product.findOne({
            _id: req.params.id
        });
        // send_report_email(listing,req.user._id, req.params.message)
        res.status(200).send(product);
    }catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
