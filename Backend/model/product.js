const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    rating: { type: Number, default: 0 }, // ✅ Number type
    images: [
        {
            public_id: { type: String, required: true },
            url: { type: String, required: true }
        }
    ],
    category: { type: String, required: true },
    noOfReview: { type: Number, default: 0 },
    review: [
        {
            name: { type: String, required: true },
            rating: { type: Number, required: true }, // ✅ Number type
            message: { type: String, required: true }
        }
    ],
    stock: { type: Number, required: true, max: 9999 }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
