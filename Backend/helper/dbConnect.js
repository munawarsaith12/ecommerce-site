// dbConnect.js
const mongoose = require("mongoose");

// For MongoDB Compass local DB
const URL = "mongodb://127.0.0.1:27017/ecommerceweb";

const dbConnect = async () => {
   
        await mongoose.connect(URL); // no options needed
        console.log("✅ MongoDB connected successfully!");
     
};

module.exports = dbConnect;