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
  const [categoryFilter, setCategoryFilter] = useState('All');
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
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    loadProducts();
    loadUserDetails();
  }, []);

  useEffect(() => {
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

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleCategoryChange = (e) => setCategoryFilter(e.target.value);

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
      <div className="text-sm text-orange-400 p-4">
        <h3 className="font-semibold">Customer ID</h3>
        <p>{customerId ? customerId : 'Loading customer ID...'}</p>
      </div>

      <div className="text-center py-10">
        <h2 className="text-4xl font-bold text-orange-500 tracking-wide">Store</h2>
        <p className="text-gray-400 text-sm mt-2">Browse our products and find the best deals.</p>
      </div>

      <div className="flex justify-center items-center gap-4 mb-10 px-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-900 border border-orange-500 text-white focus:outline-none"
        />
        <select
          onChange={handleCategoryChange}
          value={categoryFilter}
          className="px-4 py-2 rounded-lg bg-gray-900 border border-orange-500 text-white focus:outline-none"
        >
          <option value="All">All Products</option>
          <option value="Camera">Cameras</option>
          <option value="Lights">Lights</option>
        </select>
      </div>

      {['Camera', 'Lights'].map(category => (
        (categoryFilter === 'All' || categoryFilter === category) && (
          <div className="px-3 mb-12" key={category}>
            <h3 className="text-2xl font-semibold text-orange-500 mb-4 border-b border-orange-500 pb-1">
              {category}
            </h3>

            <div
              className={`grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 ${
                filteredProducts.filter(p => p.category === category).length <= 5 ? 'justify-center' : ''
              }`}
            >
              {filteredProducts.filter(p => p.category === category).length === 0 ? (
                <p className="text-gray-400">No matching {category.toLowerCase()} found.</p>
              ) : (
                filteredProducts.filter(p => p.category === category).map(product => (
                  <div
                    key={product._id}
                    className="bg-gray-900 p-4 rounded-xl shadow-lg hover:shadow-orange-500/40 transition flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full object-cover rounded-xl border border-orange-500 mb-4 transition-transform duration-300 hover:scale-105"
                        onError={(e) => e.target.src = "https://via.placeholder.com/300x200"}
                      />
                      <h4 className="text-xl font-semibold text-orange-400">{product.name}</h4>
                      <p className="text-lg font-bold text-white">${product.price}</p>
                      <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-4 rounded-lg transition self-center mt-4"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      ))}

      <div className="text-center py-12">
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
