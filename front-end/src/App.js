import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Product from './Product.js';
import Cart from './Cart.js';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [update, setUpdate] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
      setError("");
    } catch (error) {
      setError("Error retrieving products: " + error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/cart");
      setCart(response.data);
      setUpdate(false);
      setError("");
    } catch(error) {
      setError("Error retrieving cart: " + error);
    }
  }

  const addToCart = async (id) => {
    try {
      await axios.post("/api/cart/" + id);
      setUpdate(true);
    } catch (error) {
      setError("Error retrieving products: " + error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchCart();
  }, [update]);


  const idToName = (id) => {
    let item = products.find(x => x.id===id);
    if (item !== undefined) {
      return item.name;
    }
  }

  return (
    <div className="App">
      {error}
      <div className="product-cart-container">
        <div className="products">
          <h2>Products</h2>
          <div className="product-list">
            {products.map(product => (
              <Product key={product.id} product={product} setError={setError} addToCart={addToCart} />
            ))}
          </div>
        </div>
        <div className="cart">
          <h2>Cart</h2>
          <Cart cart={cart} setError={setError} setUpdate={setUpdate} idToName={idToName}></Cart>
        </div>
      </div>
    </div>
  );
}

export default App;
