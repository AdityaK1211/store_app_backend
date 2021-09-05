const mongoose = require("mongoose");

const url = process.env.MONGODB_URL

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then((result) => {
    console.log('Mongoose Started...')
}).catch(err => {
    console.error('Something went wrong', err)
})

