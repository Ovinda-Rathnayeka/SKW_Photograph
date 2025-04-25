import React, { useState, useEffect } from 'react';
import { getAllResources, createResource } from '../../API/ResourceAPI.js'; // Import API functions
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [resourceData, setResourceData] = useState({
    name: '',
    category: '',
    description: '',
    stock: '',
    rentalStock: '',
    condition: 'New',
    availabilityStatus: 'Available',
  });

  const navigate = useNavigate(); // useNavigate hook for navigation

  // Fetch all resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getAllResources();
        setResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };
    fetchResources();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResourceData({ ...resourceData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newResource = {
      name: resourceData.name,
      category: resourceData.category,
      description: resourceData.description,
      stock: resourceData.stock,
      rentalStock: resourceData.rentalStock,
      condition: resourceData.condition,
      availabilityStatus: resourceData.availabilityStatus,
    };

    try {
      await createResource(newResource);
      setShowModal(false);

      const data = await getAllResources();
      setResources(data);
    } catch (error) {
      console.error('Error creating resource:', error);
      alert('Error adding resource');
    }
  };

  const handleAddToRental = (resource) => {
    // Use navigate to redirect to the RentalAdd page with the resource data
    navigate(`/rental/${resource._id}`, { state: { resource } });
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Resources</h2>

      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
      >
        Add Resource
      </button>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-left text-gray-800">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Condition</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Stock Rental</th>
              <th className="px-4 py-2">Availability</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource._id} className="border-b">
                <td className="px-4 py-2">{resource.name}</td>
                <td className="px-4 py-2">{resource.category}</td>
                <td className="px-4 py-2">{resource.condition}</td>
                <td className="px-4 py-2">{resource.rentalStock}</td>
                <td className="px-4 py-2">{resource.stock}</td>
                <td className="px-4 py-2">{resource.availabilityStatus}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleAddToRental(resource)}
                  >
                    Add to Rental
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Resource</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">Name</label>
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

              {/* Other form fields here... */}

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
    </div>
  );
}

export default ResourcesPage;
