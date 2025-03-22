import React, { useEffect, useState } from "react";
import { fetchProducts } from "../Api/ProudctAPI.js"; // Import the fetchProducts API function
import { fetchUserDetails } from "../Api/AuthAPI.js"; // Import the fetchUserDetails API function
import { addToCart } from "../Api/CartAPI.js"; // Import the frontend cart API to add products to the cart
import { useNavigate } from "react-router-dom";

function ProductDisplay() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerId, setCustomerId] = useState(null); // Store customerId from the user details
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products when the component mounts
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); // Initially, show all products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Fetch user details to get the customerId
    const loadUserDetails = async () => {
      try {
        const userData = await fetchUserDetails(); // Fetch customer details to get customerId
        setCustomerId(userData._id); // Store the userId (customerId)
        console.log('Customer ID:', userData._id); // Display userId in the console for debugging
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    loadProducts();
    loadUserDetails();
  }, []);

  // Handle search query input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredProducts(products); // Reset to all products if search query is cleared
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  };

  // Handle adding a product to the cart
  const handleAddToCart = async (productId, quantity) => {
    if (quantity <= 0 || !customerId) {
      alert('Please select a valid quantity and ensure you\'re logged in.');
      return;
    }

    try {
      // Pass productId, quantity, price, and customerId to the backend
      const product = products.find(p => p._id === productId);
      await addToCart(productId, quantity, product.price, customerId); // Send price dynamically from the product data
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div>
      {/* Display customerId for debugging */}
      <div>
        <h3>Customer ID</h3>
        <p>{customerId ? customerId : 'Loading customer ID...'}</p>
      </div>

      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-red-500 tracking-wide">Product Display</h2>
        <p className="text-gray-400 text-sm mt-1">Browse our products and find the best deals.</p>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full p-3 text-gray-800 rounded-md mb-8 focus:outline-none"
      />

      {/* Cameras Section */}
      <h3 className="text-2xl font-semibold text-red-500 mb-5 border-b border-gray-700 pb-1">Cameras</h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        {filteredProducts.filter((product) => product.category === 'Camera').length === 0 ? (
          <p>No matching cameras found.</p>
        ) : (
          filteredProducts
            .filter((product) => product.category === 'Camera')
            .map((camera) => (
              <div key={camera._id} className="product-card">
                <img src={camera.image} alt={camera.name} className="product-image" />
                <h4>{camera.name}</h4>
                <p>${camera.price}</p>
                <p>{camera.description}</p>

                {/* Quantity selection and Add to Cart button */}
                <div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    id={`quantity-${camera._id}`}
                    className="quantity-input"
                  />
                  <button
                    onClick={() => {
                      const quantity = document.getElementById(`quantity-${camera._id}`).value;
                      handleAddToCart(camera._id, quantity); // Add product to cart
                    }}
                    className="add-to-cart-button"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Lights Section */}
      <h3 className="text-2xl font-semibold text-red-500 mb-5 border-b border-gray-700 pb-1">Lights</h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        {filteredProducts.filter((product) => product.category === 'Light').length === 0 ? (
          <p>No matching lights found.</p>
        ) : (
          filteredProducts
            .filter((product) => product.category === 'Light')
            .map((light) => (
              <div key={light._id} className="product-card">
                <img src={light.image} alt={light.name} className="product-image" />
                <h4>{light.name}</h4>
                <p>${light.price}</p>
                <p>{light.description}</p>

                {/* Quantity selection and Add to Cart button */}
                <div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    id={`quantity-${light._id}`}
                    className="quantity-input"
                  />
                  <button
                    onClick={() => {
                      const quantity = document.getElementById(`quantity-${light._id}`).value;
                      handleAddToCart(light._id, quantity); // Add product to cart
                    }}
                    className="add-to-cart-button"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Back Button */}
      <div className="text-center py-8">
        <button
          onClick={() => navigate('/')}
          className="bg-red-500 text-white font-semibold text-lg py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
        >
          Back to Home
        </button>
      </div>

      <footer className="bg-[#0D1317] text-center text-gray-400 text-sm py-4">
        <p>© 2024 SKW Photography. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default ProductDisplay;
