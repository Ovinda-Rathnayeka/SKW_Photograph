import React, { useEffect, useState } from "react";
import { fetchProducts } from "../Api/ProudctAPI.js";
import { fetchUserDetails } from "../Api/AuthAPI.js";
import { addToCart } from "../Api/CartAPI.js";
import { useNavigate } from "react-router-dom";

function ProductDisplay() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerId, setCustomerId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');  // New state for category filter
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

  useEffect(() => {
    // Apply filter whenever categoryFilter or searchQuery changes
    let filtered = products;

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [categoryFilter, searchQuery, products]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleAddToCart = async (productId) => {
    if (!customerId) {
      alert('Please ensure you\'re logged in.');
      return;
    }

    try {
      const product = products.find(p => p._id === productId);
      await addToCart(productId, 1, product.price, customerId);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Debug: Customer ID */}
      <div className="text-sm text-orange-400 p-4">
        <h3 className="font-semibold">Customer ID</h3>
        <p>{customerId ? customerId : 'Loading customer ID...'}</p>
      </div>

      {/* Header */}
      <div className="text-center py-10">
        <h2 className="text-4xl font-bold text-orange-500 tracking-wide">Product Display</h2>
        <p className="text-gray-400 text-sm mt-2">Browse our products and find the best deals.</p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-10 px-4">
        <select
          onChange={handleCategoryChange}
          value={categoryFilter}
          className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-900 border border-orange-500 text-white focus:outline-none"
        >
          <option value="All">All Products</option>
          <option value="Camera">Cameras</option>
          <option value="Lights">Lights</option>
        </select>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-10 px-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-900 border border-orange-500 text-white focus:outline-none"
        />
      </div>

      {/* Cameras */}
      {categoryFilter === 'All' || categoryFilter === 'Camera' ? (
        <div className="px-4">
          <h3 className="text-2xl font-semibold text-orange-500 mb-4 border-b border-orange-500 pb-1">Cameras</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.filter(p => p.category === 'Camera').length === 0 ? (
              <p className="text-gray-400">No matching cameras found.</p>
            ) : (
              filteredProducts.filter(p => p.category === 'Camera').map(camera => (
                <div key={camera._id} className="bg-gray-900 p-4 rounded-xl shadow-lg hover:shadow-orange-500/40 transition">
                  <img
                    src={camera.image}
                    alt={camera.name}
                    className="w-full object-cover rounded-xl border border-orange-500 mb-4 transition-transform duration-300 hover:scale-105"
                    onError={(e) => e.target.src = "https://www.fillmurray.com/300/200"} 
                  />
                  <h4 className="text-xl font-semibold text-orange-400">{camera.name}</h4>
                  <p className="text-lg font-bold text-white">${camera.price}</p>
                  <p className="text-sm text-gray-400 mb-3">{camera.description}</p>
                  <button
                    onClick={() => handleAddToCart(camera._id)}
                    className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-4 rounded-lg transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}

      {/* Lights */}
      {categoryFilter === 'All' || categoryFilter === 'Lights' ? (
        <div className="px-4 mt-12">
          <h3 className="text-2xl font-semibold text-orange-500 mb-4 border-b border-orange-500 pb-1">Lights</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.filter(p => p.category === 'Lights').length === 0 ? (
              <p className="text-gray-400">No matching lights found.</p>
            ) : (
              filteredProducts.filter(p => p.category === 'Lights').map(light => (
                <div key={light._id} className="bg-gray-900 p-4 rounded-xl shadow-lg hover:shadow-orange-500/40 transition">
                  <img
                    src={light.image}
                    alt={light.name}
                    className="w-full object-cover rounded-xl border border-orange-500 mb-4 transition-transform duration-300 hover:scale-105"
                    onError={(e) => e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found"}
                  />
                  <h4 className="text-xl font-semibold text-orange-400">{light.name}</h4>
                  <p className="text-lg font-bold text-white">${light.price}</p>
                  <p className="text-sm text-gray-400 mb-3">{light.description}</p>
                  <button
                    onClick={() => handleAddToCart(light._id)}
                    className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-4 rounded-lg transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}

      {/* Back to Home */}
      <div className="text-center py-12">
        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold text-lg py-3 px-6 rounded-xl transition"
        >
          Back to Home
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-[#0D1317] text-center text-gray-400 text-sm py-4 border-t border-gray-800">
        <p>© 2024 SKW Photography. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default ProductDisplay;
