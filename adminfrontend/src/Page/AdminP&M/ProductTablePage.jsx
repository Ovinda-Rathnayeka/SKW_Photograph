import React, { useState, useEffect } from "react";
import Navbar from "../../components/AdminP&M/Navbar.jsx";
import Sidebar from "../../components/AdminP&M/Sidebar.jsx";
import axios from "axios";

const ProductTablePage = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/product");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      image: null,
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    data.append("description", formData.description);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axios.put(`http://localhost:5000/product/${editId}`, data);
      fetchProducts();
      setEditId(null);
      setShowModal(false);
      setFormData({
        name: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
        image: null,
      });
    } catch (err) {
      console.error("Error updating product", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/product/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Product Table</h1>

          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price (Rs.)</th>
                  <th>Qty</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50">
                    <td>{prod.name}</td>
                    <td>{prod.category}</td>
                    <td>{prod.price}</td>
                    <td>{prod.quantity}</td>
                    <td>{prod.description}</td>
                    <td>
                      {prod.image && (
                        <img
                          src={prod.image}
                          alt="Product"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="space-x-2">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="btn btn-sm btn-info"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Update Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">Update Product</h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    className="input input-bordered w-full"
                    required
                  />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Camera">Camera</option>
                    <option value="Lights">Lights</option>
                  </select>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    className="input input-bordered w-full"
                    required
                  />
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Quantity"
                    className="input input-bordered w-full"
                    required
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="textarea textarea-bordered w-full"
                    required
                  />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="file-input file-input-bordered w-full"
                  />
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTablePage;
