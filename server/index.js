const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const ProductModel = require("./models/Product");

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/crud-products", {
    useNewUrlParser: true,
});



//POST request 
app.post('/insert', async (req, res) => {
    // Créer une nouvelle instance du modèle Product avec les données envoyées dans la requête
    const Product = new ProductModel({
        ProductName: req.body.ProductName,
        ProductPrice: req.body.Price,
        ProductQuantity: req.body.Quantity,
        Description: req.body.Description,
    });

    try {
        // Enregistrer le nouveau produit dans la base de données
        await Product.save();
        // Répondre avec un statut 200 (OK) et un message indiquant que le produit a été enregistré avec succès
        res.status(200).send("Product saved successfully");
    } catch (error) {
        // En cas d'erreur, afficher l'erreur dans la console et répondre avec un statut 500 (Internal Server Error)
        console.log(error);
        res.status(500).send("An error occurred");
    }
});


//GET request

// Route pour récupérer tous les produits enregistrés dans la base de données

app.get('/read', async (req, res) => {
    try {
        // Effectuer une recherche dans la base de données pour récupérer tous les produits
        const products = await ProductModel.find({});
        // Répondre avec un statut 200 (OK) et les données des produits
        res.status(200).send(products);
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred");
    }
});


// Définition de la route pour effectuer une recherche de produits en fonction du nom

app.get('/search/:name', async (req, res) => {
    // Extraction du nom du produit à partir des paramètres de l'URL
    const productName = req.params.name;
  
    try {
      const products = await ProductModel.find({ ProductName: { $regex: productName, $options: 'i' } });
        res.status(200).send(products);
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred");
    }
  });
  
  
//PUT request

app.put('/update', async (req, res) => { 
  
        const NewProductName =req.body.name ;
        const NewProductPrice=req.body.price;
        const NewProductQuantity = req.body.quantity;
        const NewProductDescription= req.body.Description;
        const id = req.body.id;
    
    try {
        await ProductModel.updateMany({_id : id},
            {ProductName : NewProductName , 
                ProductPrice : NewProductPrice , 
                ProductQuantity : NewProductQuantity , 
                Description : NewProductDescription, 
            });
        res.status(200).send("update");
        
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred");
    }
});




app.delete('/delete/:id', async (req, res) =>{
 const id = req.params.id;
 await ProductModel.findByIdAndRemove(id).exec();
 res.status(200).send("Prodcut deleted");
});



app.listen(8081, () => {
    console.log("Running on port 8081");
});
