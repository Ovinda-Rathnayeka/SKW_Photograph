import axios from "axios";

// Base URL for your backend API
const API_URL = "http://localhost:5000/feedbacks"; // Replace with your actual backend URL

// Create feedback (POST request)
const createFeedback = async (feedbackData, images) => {
  const formData = new FormData();
  formData.append("category", feedbackData.category);
  formData.append("rating", feedbackData.rating);
  formData.append("title", feedbackData.title);
  formData.append("comment", feedbackData.comment);

  // Append customerId to the FormData
  formData.append("customerId", feedbackData.customerId);

  // Append images to the formData
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
  }

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensures the data is correctly sent
      },
    });
    return response.data; // Return the created feedback data
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

// Get all feedbacks (GET request)
const getAllFeedback = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Return all feedbacks
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

// Get feedback by ID (GET request)
const getFeedbackById = async (feedbackId) => {
  try {
    const response = await axios.get(`${API_URL}/${feedbackId}`);
    return response.data; // Return feedback data for the specific ID
  } catch (error) {
    console.error("Error fetching feedback by ID:", error);
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

// Update feedback by ID (PUT request)
const updateFeedbackById = async (feedbackId, feedbackData, images) => {
  const formData = new FormData();
  formData.append("category", feedbackData.category);
  formData.append("rating", feedbackData.rating);
  formData.append("title", feedbackData.title);
  formData.append("comment", feedbackData.comment);

  // Append customerId to the FormData
  formData.append("customerId", feedbackData.customerId);

  // Append images to the formData
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
  }

  try {
    const response = await axios.put(`${API_URL}/${feedbackId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensures the data is correctly sent
      },
    });
    return response.data; // Return the updated feedback data
  } catch (error) {
    console.error("Error updating feedback:", error);
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

// Delete feedback by ID (DELETE request)
const deleteFeedbackById = async (feedbackId) => {
  try {
    const response = await axios.delete(`${API_URL}/${feedbackId}`);
    return response.data; // Return the success message from deletion
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export default {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
};
