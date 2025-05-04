import React, { useState, useEffect, useRef } from "react";
import {
  getAllResources,
  createResource,
  deleteResourceStock,
  updateResourceStockAndRentalStock,
  updateResource,
} from "../../API/ResourceAPI.js";
import { createRentalProduct } from "../../API/RentalAPI.js";

function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [deleteQuantity, setDeleteQuantity] = useState(1);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [resourceToUpdate, setResourceToUpdate] = useState(null);
  const tableRef = useRef(null);

  const [resourceData, setResourceData] = useState({
    name: "",
    category: "",
    description: "",
    stock: "",
    rentalStock: 0,
    condition: "New",
    availabilityStatus: "Available",
  });

  const [rentalForm, setRentalForm] = useState({
    quantity: "",
    price: "",
    image: null,
  });

  const [rentalErrors, setRentalErrors] = useState({
    quantity: false,
    price: false,
    image: false,
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await getAllResources();
      setResources(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResourceData({ ...resourceData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createResource(resourceData);
      setShowModal(false);
      fetchResources();
    } catch (error) {
      console.error("Error creating resource:", error);
      alert("Error adding resource");
    }
  };

  const openDeleteModal = (resource) => {
    setSelectedResource(resource);
    setDeleteQuantity(1);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedResource) return;
    if (deleteQuantity > selectedResource.stock) {
      alert("Cannot delete more than available stock!");
      return;
    }

    try {
      await deleteResourceStock(selectedResource._id, deleteQuantity);
      fetchResources();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting resource stock:", error);
      alert("Error deleting stock");
    }
  };

  const openRentalModal = (resource) => {
    setSelectedResource(resource);
    setRentalForm({ quantity: "", price: "", image: null });
    setRentalErrors({ quantity: false, price: false, image: false });
    setShowRentalModal(true);
  };

  const openUpdateModal = (resource) => {
    setResourceToUpdate(resource);
    setResourceData({
      name: resource.name,
      category: resource.category,
      description: resource.description,
      stock: resource.stock,
      rentalStock: resource.rentalStock,
      condition: resource.condition,
      availabilityStatus: resource.availabilityStatus,
    });
    setShowUpdateModal(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Resources</h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Resource
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Assign Resources
        </button>
      </div>

      <div
        className="overflow-x-auto bg-white shadow-md rounded-lg"
        ref={tableRef}
      >
        <table className="min-w-full text-left text-gray-800">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Condition</th>
              <th className="px-4 py-2">Total Stock</th>
              <th className="px-4 py-2">Rental</th>
              <th className="px-4 py-2">Remaining Stock</th>
              <th className="px-4 py-2">Availability</th>
              <th className="px-4 py-2">
                <center>Action</center>
              </th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource._id} className="border-b">
                <td className="px-4 py-2">{resource.name}</td>
                <td className="px-4 py-2">{resource.category}</td>
                <td className="px-4 py-2">{resource.condition}</td>
                <td className="px-4 py-2">
                  {resource.stock + resource.rentalStock}
                </td>
                <td className="px-4 py-2">{resource.rentalStock}</td>
                <td className="px-4 py-2">{resource.stock}</td>
                <td className="px-4 py-2">{resource.availabilityStatus}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-1.5 bg-blue-100 text-blue-600 border border-blue-500 rounded-md font-medium hover:bg-blue-500 hover:text-white transition duration-200"
                      onClick={() => openRentalModal(resource)}
                    >
                      Add to Rental
                    </button>
                    <button
                      className="px-4 py-1.5 bg-yellow-100 text-yellow-600 border border-yellow-500 rounded-md font-medium hover:bg-yellow-500 hover:text-white transition duration-200"
                      onClick={() => openUpdateModal(resource)}
                    >
                      Update
                    </button>

                    <button
                      className="px-4 py-1.5 bg-red-100 text-red-600 border border-red-500 rounded-md font-medium hover:bg-red-500 hover:text-white transition duration-200"
                      onClick={() => openDeleteModal(resource)}
                    >
                      Remove Resource
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Resource Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Resource</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={resourceData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              {/* You can add other fields here the same way */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedResource && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h3 className="text-lg font-semibold mb-4">
              Delete Resource: {selectedResource.name}
            </h3>
            <p className="mb-2">Available Stock: {selectedResource.stock}</p>
            <div className="mb-4">
              <label className="block font-medium mb-1">
                Quantity to Delete
              </label>
              <input
                type="number"
                min={1}
                max={selectedResource.stock}
                value={deleteQuantity}
                onChange={(e) => setDeleteQuantity(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && resourceToUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[450px]">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Update Resource: {resourceToUpdate.name}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await updateResource(resourceToUpdate._id, {
                    ...resourceData,
                    stock: parseInt(resourceData.stock),
                    rentalStock: parseInt(resourceData.rentalStock),
                  });
                  setShowUpdateModal(false);
                  setResourceToUpdate(null);
                  fetchResources();
                } catch (err) {
                  console.error("Error updating resource:", err);
                  alert("Failed to update resource.");
                }
              }}
            >
              {/* Category Dropdown */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Category
                </label>
                <select
                  name="category"
                  value={resourceData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Camera">Camera</option>
                  <option value="Video Camera">Video Camera</option>
                  <option value="Lights">Lights</option>
                  <option value="Tripods">Tripods</option>
                  <option value="Gimbals">Gimbals</option>
                  <option value="Action Camera">Action Camera</option>
                  <option value="Drone">Drone</option>
                </select>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={resourceData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={resourceData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter description"
                  required
                />
              </div>

              {/* Condition */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Condition
                </label>
                <input
                  type="text"
                  name="condition"
                  value={resourceData.condition}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., New, Good, Used"
                  required
                />
              </div>

              {/* Stock */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  min={1}
                  value={resourceData.stock}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter total stock"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setResourceToUpdate(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Update Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[450px]">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Add New Resource
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Category Dropdown */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Category
                </label>
                <select
                  name="category"
                  value={resourceData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Camera">Camera</option>
                  <option value="Video Camera">Video Camera</option>
                  <option value="Lights">Lights</option>
                  <option value="Tripods">Tripods</option>
                  <option value="Gimbals">Gimbals</option>
                  <option value="Action Camera">Action Camera</option>
                  <option value="Drone">Drone</option>
                </select>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={resourceData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={resourceData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter description"
                  required
                />
              </div>

              {/* Condition */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Condition
                </label>
                <input
                  type="text"
                  name="condition"
                  value={resourceData.condition}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., New, Good, Used"
                  required
                />
              </div>

              {/* Stock */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  min={1}
                  value={resourceData.stock}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter total stock"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rental Modal */}
      {showRentalModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h3 className="text-lg font-semibold mb-4">
              Add to Rental: {selectedResource.name}
            </h3>
            <p>
              <strong>Category:</strong> {selectedResource.category}
            </p>
            <p>
              <strong>Description:</strong> {selectedResource.description}
            </p>
            <p className="mb-4">
              <strong>Available Stock:</strong> {selectedResource.stock}
            </p>

            <div className="mb-3">
              <label className="block font-medium">Quantity</label>
              <input
                type="number"
                min={1}
                max={selectedResource.stock}
                value={rentalForm.quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setRentalForm({ ...rentalForm, quantity: val });
                  setRentalErrors({
                    ...rentalErrors,
                    quantity: val > selectedResource.stock || val <= 0,
                  });
                }}
                className="w-full p-2 border rounded"
              />
              {rentalErrors.quantity && (
                <p className="text-sm text-red-500">Invalid quantity</p>
              )}
            </div>

            <div className="mb-3">
              <label className="block font-medium">Price (Rs/day)</label>
              <div className="relative">
                <span className="absolute left-2 top-2.5">Rs.</span>
                <input
                  type="number"
                  min={1}
                  value={rentalForm.price}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setRentalForm({ ...rentalForm, price: val });
                    setRentalErrors({ ...rentalErrors, price: val <= 0 });
                  }}
                  className="w-full p-2 pl-10 border rounded"
                />
              </div>
              {rentalErrors.price && (
                <p className="text-sm text-red-500">
                  Price must be greater than 0
                </p>
              )}
            </div>

            <div className="mb-3">
              <label className="block font-medium">
                Upload Image (jpg, jpeg, png)
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const valid =
                    file &&
                    ["image/jpeg", "image/jpg", "image/png"].includes(
                      file.type
                    );
                  setRentalForm({ ...rentalForm, image: file });
                  setRentalErrors({ ...rentalErrors, image: !valid });
                }}
                className="w-full p-2 border rounded"
              />
              {rentalErrors.image && (
                <p className="text-sm text-red-500">Invalid file type</p>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowRentalModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const formData = new FormData();
                  formData.append("name", selectedResource.name);
                  formData.append("category", selectedResource.category);
                  formData.append("description", selectedResource.description);
                  formData.append("rentalStock", rentalForm.quantity);
                  formData.append("price", rentalForm.price);
                  formData.append("condition", selectedResource.condition);
                  formData.append("availabilityStatus", "Available");
                  formData.append("images", rentalForm.image);

                  try {
                    const rentalQty = parseInt(rentalForm.quantity);
                    const updatedStock = selectedResource.stock - rentalQty;
                    const updatedRentalStock =
                      selectedResource.rentalStock + rentalQty;

                    await createRentalProduct(formData);
                    await updateResourceStockAndRentalStock(
                      selectedResource._id,
                      updatedStock,
                      updatedRentalStock
                    );

                    await fetchResources();
                    setShowRentalModal(false);
                  } catch (err) {
                    console.error("Error adding rental:", err);
                    alert("Failed to add rental.");
                  }
                }}
                disabled={
                  rentalErrors.quantity ||
                  rentalErrors.price ||
                  rentalErrors.image ||
                  !rentalForm.quantity ||
                  !rentalForm.price ||
                  !rentalForm.image
                }
                className={`px-4 py-2 rounded text-white ${
                  rentalErrors.quantity ||
                  rentalErrors.price ||
                  rentalErrors.image ||
                  !rentalForm.quantity ||
                  !rentalForm.price ||
                  !rentalForm.image
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Submit Rental
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourcesPage;
