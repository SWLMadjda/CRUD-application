import React, { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';

function App() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState('');
  const [productList, setProductList] = useState([]);
  const [searchProductName, setSearchProductName] = useState('');
  const [priceError, setPriceError] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [modificationValues, setModificationValues] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await Axios.get('http://localhost:8081/read');
      setProductList(response.data);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const searchProductByName = async () => {
    try {
      //Stock du résultat de la route GET avec "Url dynamique qui contient le produit recherché " comme argument" dans la variable response
      const response = await Axios.get(`http://localhost:8081/search/${searchProductName}`);
      setProductList(response.data);//mis à jour la variable d'état productList avec les données renvoyées par la requête HTTP GET
    } catch (error) {
      console.log(error);
      alert("An error occurred while searching for the product.");
    }
  };

  const handlePriceChange = (event) => {
    const value = Number(event.target.value);
    setPrice(value);

    if (value <= 0) {
      setPriceError('Price must be greater than zero');
    } else {
      setPriceError('');
    }
  };

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value);
    setQuantity(value);

    if (value <= 0) {
      setQuantityError('Quantity must be greater than zero');
    } else {
      setQuantityError('');
    }
  };

  const AddToList = () => {
    //Gestion d'erreurs
    if (productName.trim() === '') {
      alert('Product name cannot be empty');
      return;
    }

    if (price <= 0) {
      alert('Price must be greater than zero');
      return;
    }

    if (quantity <= 0) {
      alert('Quantity must be greater than zero');
      return;
    }

    if (description.trim() === '') {
      alert('Product description cannot be empty');
      return;
    }
    // Envoie une requête POST pour ajouter le nouveau produit à la base de données
    Axios.post('http://localhost:8081/insert', {
      ProductName: productName,
      Price: price,
      Quantity: quantity,
      Description: description,
    })
    //si la requete POST est réussie
      .then(() => {
        alert('Product added successfully');
        fetchData();
        setProductName('');
        setPrice(0);
        setQuantity(0);
        setDescription('');
      })
      //Si la requete POST echoue 
      .catch((error) => {
        console.log('Error adding product:', error);
      });
  };

  

  const updateProduct = async (id) => {
    // Gestion d'erreurs
    if (modificationValues[id]?.newProductName?.trim() === '') {
      alert('The new product name cannot be empty');
      return;
    }
  
    if (modificationValues[id]?.newProductPrice <= 0) {
      alert('New price must be greater than zero');
      return;
    }
  
    if (modificationValues[id]?.newProductQuantity <= 0) {
      alert('New quantity must be greater than zero');
      return;
    }
  
    if (modificationValues[id]?.newProductDescription?.trim() === '') {
      alert('Product description cannot be empty');
      return;
    }
  
    try {
      await Axios.put('http://localhost:8081/update', {
        id: id,
        name: modificationValues[id]?.newProductName || productName,
        price: modificationValues[id]?.newProductPrice || price,
        quantity: modificationValues[id]?.newProductQuantity || quantity,
        description: modificationValues[id]?.newProductDescription || description,
      });
  
      alert('Product updated successfully');
      fetchData();
  
      setModificationValues((prevValues) => ({
        ...prevValues,
        [id]: {
          newProductName: '',
          newProductPrice: '',
          newProductQuantity: '',
          newProductDescription: '',
        },
      }));
    } catch (error) {
      console.log('Error updating product:', error);
    }
  };
  

  const deleteProduct = async (id) => {
    try {
      await Axios.delete(`http://localhost:8081/delete/${id}`);
      alert('Product deleted successfully');
      fetchData();
    } catch (error) {
      console.log('Error deleting product:', error);
    }
  };
  

  return (
    <div className="App">
      <h1>Confledis "CRUD application"</h1>
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search ..."
          value={searchProductName}
          onChange={(event) => setSearchProductName(event.target.value)}
        />
        <button className="search-button" onClick={searchProductByName}>
          Search
        </button>
      </div>

      <div className="info-product">
        <label>Product's name</label>
        <input type="text" value={productName} onChange={(event) => setProductName(event.target.value)} />
        <label>Product's price</label>
        <input type="number" value={price} onChange={handlePriceChange} />
        {priceError && <div className="error-message">{priceError}</div>}
        <label>Product's quantity</label>
        <input type="number" value={quantity} onChange={handleQuantityChange} />
        {quantityError && <div className="error-message">{quantityError}</div>}
        <label>Product's description</label>
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button onClick={AddToList}>Add product</button>
      </div>
      <hr />
      <h1>Product's list</h1>
      <div className="product-list">
        {productList.map((val) => (
          <div className="product-container" key={val._id}>
            <h1>{val.ProductName}</h1>
            <h1>{val.ProductPrice}</h1>
            <h1>{val.ProductQuantity}</h1>
          
            <p>{val.Description}</p>
            <div>
              <input
                type="text"
                placeholder="New product name ..."
                value={modificationValues[val._id]?.newProductName || ''}
                onChange={(event) => {
                  setModificationValues((prevValues) => ({
                    ...prevValues,
                    [val._id]: {
                      ...prevValues[val._id],
                      newProductName: event.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="New product price ..."
                value={modificationValues[val._id]?.newProductPrice || ''}
                onChange={(event) => {
                  setModificationValues((prevValues) => ({
                    ...prevValues,
                    [val._id]: {
                      ...prevValues[val._id],
                      newProductPrice: event.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="New product quantity ..."
                value={modificationValues[val._id]?.newProductQuantity || ''}
                onChange={(event) => {
                  setModificationValues((prevValues) => ({
                    ...prevValues,
                    [val._id]: {
                      ...prevValues[val._id],
                      newProductQuantity: event.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="New product description ..."
                value={modificationValues[val._id]?.newProductDescription || ''}
                onChange={(event) => {
                  setModificationValues((prevValues) => ({
                    ...prevValues,
                    [val._id]: {
                      ...prevValues[val._id],
                      newProductDescription: event.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div className="button-group">
              <button className="update-button" onClick={() => updateProduct(val._id)}>Update</button>
              <button className="delete-button" onClick={() => deleteProduct(val._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
