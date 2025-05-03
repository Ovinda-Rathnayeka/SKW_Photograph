import React, { useEffect, useState } from "react";
import { fetchProducts } from "../Api/ProudctAPI.js";
import { fetchUserDetails } from "../Api/AuthAPI.js";
import { addToCart } from "../Api/CartAPI.js";
import { useNavigate } from "react-router-dom";

function ProductDisplay() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [customerId, setCustomerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const loadUserDetails = async () => {
      try {
        const userData = await fetchUserDetails();
        setCustomerId(userData._id);
        console.log('Customer ID:', userData._id);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    loadProducts();
    loadUserDetails();
  }, []);

  const applyFilters = (query, category) => {
    let filtered = products;

    if (query) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    }

    if (category !== 'All') {
      filtered = filtered.filter((product) => {
        const prodCategory = product.category?.toLowerCase();
        if (category === 'Camera') {
          return prodCategory === 'camera';
        } else if (category === 'Light') {
          return prodCategory === 'light' || prodCategory === 'lights';
        }
        return true;
      });
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilters(query, categoryFilter);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setCategoryFilter(category);
    applyFilters(searchQuery, category);
  };

  const handleAddToCart = async (productId, quantity) => {
    if (quantity <= 0 || !customerId) {
      alert('Please select a valid quantity and ensure you\'re logged in.');
      return;
    }

    try {
      const product = products.find(p => p._id === productId);
      await addToCart(productId, quantity, product.price, customerId);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div>
      {/* Top Section */}
      <div className="text-center py-10">
        <h2 className="text-4xl font-bold text-orange-500 tracking-wide">Store</h2>
        <p className="text-gray-400 text-sm mt-2">Browse our products and find the best deals.</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-3 text-gray-800 rounded-md focus:outline-none border-2 border-black w-64"
        />
        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="p-3 text-gray-800 rounded-md focus:outline-none border-2 border-black w-48"
        >
          <option value="All">All</option>
          <option value="Camera">Camera</option>
          <option value="Light">Light</option>
        </select>
      </div>

      {/* Cameras Section */}
      {categoryFilter === 'All' || categoryFilter === 'Camera' ? (
        <>
          <h3 className="text-2xl font-semibold text-red-500 mb-5 border-b border-gray-700 pb-1">Cameras</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
            {filteredProducts.filter((product) => product.category?.toLowerCase() === 'camera').length === 0 ? (
              <p>No matching cameras found.</p>
            ) : (
              filteredProducts
                .filter((product) => product.category?.toLowerCase() === 'camera')
                .map((camera) => (
                  <div key={camera._id} className="product-card">
                    <img src={camera.image} alt={camera.name} className="product-image" />
                    <h4>{camera.name}</h4>
                    <p>${camera.price}</p>
                    <p>{camera.description}</p>

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
                          handleAddToCart(camera._id, quantity);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded mt-2"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </>
      ) : null}

      {/* Lights Section */}
      {categoryFilter === 'All' || categoryFilter === 'Light' ? (
        <>
          <h3 className="text-2xl font-semibold text-red-500 mb-5 border-b border-gray-700 pb-1">Lights</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
            {filteredProducts.filter((product) => {
              const category = product.category?.toLowerCase();
              return category === 'light' || category === 'lights';
            }).length === 0 ? (
              <p>No matching lights found.</p>
            ) : (
              filteredProducts
                .filter((product) => {
                  const category = product.category?.toLowerCase();
                  return category === 'light' || category === 'lights';
                })
                .map((light) => (
                  <div key={light._id} className="product-card">
                    <img src={light.image} alt={light.name} className="product-image" />
                    <h4>{light.name}</h4>
                    <p>${light.price}</p>
                    <p>{light.description}</p>

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
                          handleAddToCart(light._id, quantity);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded mt-2"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </>
      ) : null}

      {/* Back Button */}
      <div className="text-center py-8">
        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold text-lg py-3 px-6 rounded-xl transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default ProductDisplay;
