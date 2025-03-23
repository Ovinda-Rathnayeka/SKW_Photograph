import React, { useState } from "react";
import axios from "axios";

const AdminProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] || null });
    } else if (name === "quantity" || name === "price") {
      // Allow only digits
      if (/^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Description word limit
    const wordCount = formData.description.trim().split(/\s+/).length;
    if (wordCount > 100) {
      alert("Description cannot exceed 500 words.");
      return;
    }

    // Quantity check
    if (formData.quantity === "" || parseInt(formData.quantity, 10) < 0) {
      alert("Quantity must be a non-negative number.");
      return;
    }

    // Price check
    if (formData.price === "" || isNaN(formData.price)) {
      alert("Please enter a valid price.");
      return;
    }

    // Image check
    if (!formData.image) {
      alert("Please upload an image.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    data.append("description", formData.description);
    data.append("image", formData.image);

    try {
      await axios.post("http://localhost:5000/product", data);
      setFormData({
        name: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
        image: null,
      });
    } catch (err) {
      console.error("Error adding product", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleInputChange}
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
          type="text"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          required
        />
        <input
          type="text"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="textarea textarea-bordered w-full"
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleInputChange}
          className="file-input file-input-bordered w-full"
          required
        />
        <button type="submit" className="btn btn-primary w-full">Add Product</button>
      </form>
    </div>
  );
};

export default AdminProductPage;
