const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js')

// database connectivity code
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
main().then(() => {
    console.log("connected to database successfully");
}).catch((err) => {
    console.log("err");
});

async function main() {
    await mongoose.connect(MONGO_URL);
}
/*******************************************************/

// Initialize database
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner : '65b628a3ad83153861c0a5ff'}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();