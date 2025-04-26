import axios from "axios";

<<<<<<< HEAD
const API_URL = "http://localhost:5000/feedbacks"; // Replace if deployed

// Create feedback
=======

const API_URL = "http://localhost:5000/feedbacks"; 


>>>>>>> main
const createFeedback = async (feedbackData, images) => {
  const formData = new FormData();
  formData.append("category", feedbackData.category);
  formData.append("rating", feedbackData.rating);
  formData.append("title", feedbackData.title);
  formData.append("comment", feedbackData.comment);
<<<<<<< HEAD
  formData.append("customerId", feedbackData.customerId);

  // ✅ Append the 4 new ratings
  formData.append("serviceQuality", feedbackData.serviceQuality);
  formData.append("responseTime", feedbackData.responseTime);
  formData.append("valueForMoney", feedbackData.valueForMoney);
  formData.append("overallExperience", feedbackData.overallExperience);

=======


  formData.append("customerId", feedbackData.customerId);

 
>>>>>>> main
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
  }

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
<<<<<<< HEAD
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
=======
        "Content-Type": "multipart/form-data", 
      },
    });
    return response.data; 
>>>>>>> main
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

<<<<<<< HEAD
// Get all feedbacks
=======

>>>>>>> main
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

<<<<<<< HEAD
// Get feedback by ID
const getFeedbackById = async (feedbackId) => {
  try {
    const response = await axios.get(`${API_URL}/${feedbackId}`);
    return response.data;
=======

const getFeedbackById = async (feedbackId) => {
  try {
    const response = await axios.get(`${API_URL}/${feedbackId}`);
    return response.data; 
>>>>>>> main
  } catch (error) {
    console.error("Error fetching feedback by ID:", error);
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

<<<<<<< HEAD
// Update feedback
=======

>>>>>>> main
const updateFeedbackById = async (feedbackId, feedbackData, images) => {
  const formData = new FormData();
  formData.append("category", feedbackData.category);
  formData.append("rating", feedbackData.rating);
  formData.append("title", feedbackData.title);
  formData.append("comment", feedbackData.comment);
<<<<<<< HEAD
  formData.append("customerId", feedbackData.customerId);

  // ✅ Append the 4 updated ratings
  formData.append("serviceQuality", feedbackData.serviceQuality);
  formData.append("responseTime", feedbackData.responseTime);
  formData.append("valueForMoney", feedbackData.valueForMoney);
  formData.append("overallExperience", feedbackData.overallExperience);

=======

  
  formData.append("customerId", feedbackData.customerId);

  
>>>>>>> main
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
  }

  try {
    const response = await axios.put(`${API_URL}/${feedbackId}`, formData, {
      headers: {
<<<<<<< HEAD
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
=======
        "Content-Type": "multipart/form-data", 
      },
    });
    return response.data; 
>>>>>>> main
  } catch (error) {
    console.error("Error updating feedback:", error);
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

<<<<<<< HEAD
// Delete feedback
const deleteFeedbackById = async (feedbackId) => {
  try {
    const response = await axios.delete(`${API_URL}/${feedbackId}`);
    return response.data;
=======

const deleteFeedbackById = async (feedbackId) => {
  try {
    const response = await axios.delete(`${API_URL}/${feedbackId}`);
    return response.data; 
>>>>>>> main
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
