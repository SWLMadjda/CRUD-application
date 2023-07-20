const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    ProductName: {
        type: String,
        required: true,
    },
    ProductPrice: {
        type: Number,
        required: true,
    },
    ProductQuantity: {
        type: Number,
        required: true,
    },
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;
