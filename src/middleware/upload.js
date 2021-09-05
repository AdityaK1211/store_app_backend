const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const profile_image = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        key: function (req, file, cb) {
            cb(null, "profile_image/"+file.originalname);
        }
    })
});

const product_images = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        key: function (req, file, cb) {
            cb(null, "product_images/"+file.originalname);
        }
    })
});

module.exports = {profile_image, product_images, s3};
