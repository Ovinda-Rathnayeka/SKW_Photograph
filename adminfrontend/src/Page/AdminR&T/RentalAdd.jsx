import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createRentalProduct } from '../../API/RentalAPI.js'; // Import the API function
import { updateResourceStockAndRentalStock } from '../../API/ResourceAPI.js'; // Import the API function to update stock

function RentalAdd() {
  const location = useLocation();
  const { resource } = location.state || {}; // Access resource data passed via location.state

  const navigate = useNavigate(); // Navigate after form submission

  // Log the resource ID in the console for debugging
  useEffect(() => {
    if (resource) {
      console.log("Resource ID:", resource._id); // Log resource ID for debugging
    }
  }, [resource]);

  const [rentalData, setRentalData] = useState({
    name: resource ? resource.name : '',
    category: resource ? resource.category : '',
    description: resource ? resource.description : '',
    rentalStock: '', // User input for rental stock
    price: '', // Rental price
    condition: resource ? resource.condition : '',
    availabilityStatus: 'Available', // Default to Available
    images: [], // To hold uploaded images
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRentalData({ ...rentalData, [name]: value });
  };

  const handleFileChange = (e) => {
    setRentalData({ ...rentalData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate rental stock input
    if (rentalData.rentalStock <= 0) {
      alert("Rental stock must be greater than zero");
      return;
    }

    // Create FormData to send in the API request
    const formData = new FormData();
    formData.append('name', rentalData.name);
    formData.append('category', rentalData.category);
    formData.append('description', rentalData.description);
    formData.append('rentalStock', rentalData.rentalStock);
    formData.append('price', rentalData.price);
    formData.append('condition', rentalData.condition);
    formData.append('availabilityStatus', rentalData.availabilityStatus);

    // Append images to form data
    for (const file of rentalData.images) {
      formData.append('images', file);
    }

    try {
      // Step 1: Create rental product
      const response = await createRentalProduct(formData);
      console.log('Rental Product Created:', response);

      // Step 2: Update resource stock and rental stock
      const updatedStock = resource.stock - rentalData.rentalStock;
      const updatedRentalStock = resource.rentalStock + rentalData.rentalStock;

      // Update resource table: Decrease stock and increase rentalStock
      await updateResourceStockAndRentalStock(
        resource._id, // resource id from the resource data passed
        updatedStock, // Decrease stock by rentalStock
        updatedRentalStock // Increase rental stock by rentalStock
      );

      alert('Rental product added and resource stock updated successfully!');
      navigate('/resources'); // Navigate back to resources page after successful submission
    } catch (error) {
      console.error('Error creating rental product:', error);
      alert('Error adding rental product');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Add Rental Product</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={rentalData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={rentalData.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={rentalData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            rows="4"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="rentalStock" className="block text-gray-700">Stock Quantity</label>
          <input
            type="number"
            id="rentalStock"
            name="rentalStock"
            value={rentalData.rentalStock}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={rentalData.price}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="condition" className="block text-gray-700">Condition</label>
          <input
            type="text"
            id="condition"
            name="condition"
            value={rentalData.condition}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="availabilityStatus" className="block text-gray-700">Availability Status</label>
          <select
            id="availabilityStatus"
            name="availabilityStatus"
            value={rentalData.availabilityStatus}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="images" className="block text-gray-700">Upload Images</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            multiple
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Rental Product
        </button>
      </form>
    </div>
  );
}

export default RentalAdd;
