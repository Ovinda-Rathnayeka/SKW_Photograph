import React, { useState, useEffect } from "react";
import feedbackAPI from "../Api/FeedbackAPI"; // Import the feedback API methods
import { fetchUserDetails } from "../Api/AuthAPI"; // Import the fetchUserDetails method for fetching customer details

function AddFeedback() {
  const [feedbackData, setFeedbackData] = useState({
    category: "",
    rating: 1,
    title: "",
    comment: "",
  });
  const [images, setImages] = useState([]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user details (customer email and customerId)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await fetchUserDetails(); // Fetch customer details
        setCustomerEmail(userDetails.email); // Set email
        setCustomerId(userDetails._id); // Set customerId
      } catch (err) {
        setError("Error fetching customer details.");
      }
    };
    fetchUser();
  }, []);

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData({
      ...feedbackData,
      [name]: value,
    });
  };

  // Handle image change
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Log the feedback data to the console before sending it
    console.log("Feedback Data: ", {
      ...feedbackData,
      customerEmail,
      customerId,
    });

    try {
      // Ensure customerId is set before submitting the feedback
      if (!customerId) {
        setError("Customer ID is missing.");
        setLoading(false);
        return;
      }

      // Add customer email and customerId to the form data
      const feedbackWithCustomer = {
        ...feedbackData,
        customerEmail,
        customerId,
      };

      // Send feedback data and images to the backend
      await feedbackAPI.createFeedback(feedbackWithCustomer, images);
      setLoading(false);
      alert("Feedback added successfully!");
      setFeedbackData({ category: "", rating: 1, title: "", comment: "" });
      setImages([]);
    } catch (err) {
      setLoading(false);
      setError("Failed to add feedback.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Add Feedback</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Email (Customer Email)</label>
          <input
            type="email"
            name="email"
            value={customerEmail}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={feedbackData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={feedbackData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Comment</label>
          <textarea
            name="comment"
            value={feedbackData.comment}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Rating</label>
          <input
            type="number"
            name="rating"
            value={feedbackData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Upload Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Adding Feedback..." : "Add Feedback"}
        </button>
      </form>
    </div>
  );
}

export default AddFeedback;
