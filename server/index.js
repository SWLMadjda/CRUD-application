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
    const Product = new ProductModel({
        ProductName: req.body.ProductName,
        ProductPrice: req.body.Price,
        ProductQuantity: req.body.Quantity,
        Description: req.body.Description,
    });

    try {
        await Product.save();
        res.status(200).send("Product saved successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred");
    }
});

app.get('/search/:name', async (req, res) => {
    const productName = req.params.name;
    
    try {
      const products = await ProductModel.find({ ProductName: { $regex: productName, $options: 'i' } });
      res.status(200).send(products); 
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred");
    }
  });
  

//GET request

app.get('/read', async (req, res) => {
    
    try {
        const products = await ProductModel.find({});
        res.status(200).send(products);
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred");
    }
});


app.put('/update', async (req, res) => { 
  
        const NewProductName =req.body.name ;
        const NewProductPrice=req.body.price;
        const NewProductQuantity = req.body.quantity;
        const NewProductDescription= req.body.Description;
        const id = req.body.id;
    
    try {
        await ProductModel.updateMany({_id : id},{ProductName : NewProductName , ProductPrice : NewProductPrice , ProductQuantity : NewProductQuantity , Description : NewProductDescription, });
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
