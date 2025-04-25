import axios from "axios";

const API_URL = "http://localhost:5000/feedbacks"; // Replace if deployed

// Create feedback
const createFeedback = async (feedbackData, images) => {
  const formData = new FormData();
  formData.append("category", feedbackData.category);
  formData.append("rating", feedbackData.rating);
  formData.append("title", feedbackData.title);
  formData.append("comment", feedbackData.comment);

  // Append customerId to the FormData
  formData.append("customerId", feedbackData.customerId);

<<<<<<< HEAD
  // Append images to the formData
=======
  // ✅ Append the 4 new ratings
  formData.append("serviceQuality", feedbackData.serviceQuality);
  formData.append("responseTime", feedbackData.responseTime);
  formData.append("valueForMoney", feedbackData.valueForMoney);
  formData.append("overallExperience", feedbackData.overallExperience);

>>>>>>> pinidu_backup
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

// Get all feedbacks
const getAllFeedback = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

// Get feedback by ID
const getFeedbackById = async (feedbackId) => {
  try {
    const response = await axios.get(`${API_URL}/${feedbackId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback by ID:", error);
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

// Update feedback
const updateFeedbackById = async (feedbackId, feedbackData, images) => {
  const formData = new FormData();
  formData.append("category", feedbackData.category);
  formData.append("rating", feedbackData.rating);
  formData.append("title", feedbackData.title);
  formData.append("comment", feedbackData.comment);

  // Append customerId to the FormData
  formData.append("customerId", feedbackData.customerId);

<<<<<<< HEAD
  // Append images to the formData
=======
  // ✅ Append the 4 updated ratings
  formData.append("serviceQuality", feedbackData.serviceQuality);
  formData.append("responseTime", feedbackData.responseTime);
  formData.append("valueForMoney", feedbackData.valueForMoney);
  formData.append("overallExperience", feedbackData.overallExperience);

>>>>>>> pinidu_backup
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

// Delete feedback
const deleteFeedbackById = async (feedbackId) => {
  try {
    const response = await axios.delete(`${API_URL}/${feedbackId}`);
    return response.data;
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
