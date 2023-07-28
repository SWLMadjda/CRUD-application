// Importer le module Mongoose pour gérer la base de données MongoDB
const mongoose = require("mongoose");

// Définir le schéma de données pour les produits
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
    Description: {
        type: String,
        required: true,
    }
});

// Créer le modèle de données pour les produits en utilisant le schéma défini
const Product = mongoose.model("products", productSchema);

// Exporter le modèle pour pouvoir l'utiliser dans d'autres fichiers
module.exports = Product;
