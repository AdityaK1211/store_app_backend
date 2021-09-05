const express = require("express");
const userRouter = require("./router/user");
const productsRouter = require("./router/product");
const cartRouter = require("./router/cart");
const messageRouter = require("./router/message");
// const aboutRouter = require("./router/about");
require("../src/db/mongoose");
const path = require("path");

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/products", productsRouter);
app.use("/carts", cartRouter);
app.use("/message" , messageRouter);
// app.use("/about", aboutRouter);
app.use('*', (req, res) => {
    return res.status(404).json({
        success: false,
        message: 'API endpoint doesnt exist'
    })
});
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT;

app.listen(port, () => {
    console.log("Server is on | " + port);
});
