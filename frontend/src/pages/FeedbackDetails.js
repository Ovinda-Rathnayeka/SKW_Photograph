import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import feedbackAPI from "../Api/FeedbackAPI"; 
import { fetchUserDetails } from "../Api/AuthAPI"; 

function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [userId, setUserId] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [feedbackToUpdate, setFeedbackToUpdate] = useState(null); 

  
  const fetchAllFeedbacks = async () => {
    try {
      const feedbackData = await feedbackAPI.getAllFeedback();
      setFeedbacks(feedbackData);
      setLoading(false); 
    } catch (err) {
      setError("Error fetching feedbacks.");
      setLoading(false); 
    }
  };

  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await fetchUserDetails();
        setUserId(userDetails._id); 
      } catch (err) {
        setUserId(null); 
      }
    };
    fetchUser();
    fetchAllFeedbacks();
  }, []);

  if (loading) {
    return <div className="text-center p-6">Loading feedbacks...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  
  const handleDelete = async (feedbackId) => {
    try {
      await feedbackAPI.deleteFeedbackById(feedbackId);
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== feedbackId)); 
    } catch (err) {
      setError("Error deleting feedback.");
    }
  };

  
  const handleOpenModal = (feedback) => {
    setFeedbackToUpdate(feedback); 
    setShowModal(true); 
  };

  
  const handleCloseModal = () => {
    setShowModal(false);
    setFeedbackToUpdate(null); 
  };

  
  const handleUpdateFeedback = async (updatedFeedbackData) => {
    try {
      await feedbackAPI.updateFeedbackById(
        feedbackToUpdate._id,
        updatedFeedbackData
      );
      setFeedbacks(
        feedbacks.map((feedback) =>
          feedback._id === feedbackToUpdate._id
            ? { ...feedback, ...updatedFeedbackData }
            : feedback
        )
      );
      setShowModal(false); 
    } catch (err) {
      setError("Error updating feedback.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">All Feedback</h1>

      
      {userId && (
        <Link to="/add-feedback">
          <button className="bg-blue-500 text-white py-2 px-4 rounded mb-6 hover:bg-blue-700">
            Add Feedback
          </button>
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedbacks.length === 0 ? (
          <p className="text-center col-span-3">No feedback available.</p>
        ) : (
          feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
            >
              <h2 className="text-2xl font-semibold mb-4">{feedback.title}</h2>
              <div className="flex items-center mb-4">
                <span className="text-yellow-500">
                  {"★".repeat(feedback.rating)}{" "}
                  {"☆".repeat(5 - feedback.rating)}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{feedback.category}</p>
              <p className="text-gray-800 mb-4">{feedback.comment}</p>

              
              <div className="flex flex-wrap gap-4">
                {feedback.images && feedback.images.length > 0 ? (
                  feedback.images.map((image, index) => (
                    <div
                      key={index}
                      className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`feedback-img-${index}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No images available</p>
                )}
              </div>

              
              {userId && feedback.customerId === userId && (
                <div className="mt-4 flex justify-between">
                  
                  <button
                    onClick={() => handleOpenModal(feedback)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700"
                  >
                    Update
                  </button>

                 
                  <button
                    onClick={() => handleDelete(feedback._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      
      {showModal && feedbackToUpdate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Update Feedback</h2>
           
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateFeedback(feedbackToUpdate);
              }}
            >
              <div className="mb-4">
                <label className="block mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={feedbackToUpdate.category}
                  onChange={(e) =>
                    setFeedbackToUpdate({
                      ...feedbackToUpdate,
                      category: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={feedbackToUpdate.title}
                  onChange={(e) =>
                    setFeedbackToUpdate({
                      ...feedbackToUpdate,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Comment</label>
                <textarea
                  name="comment"
                  value={feedbackToUpdate.comment}
                  onChange={(e) =>
                    setFeedbackToUpdate({
                      ...feedbackToUpdate,
                      comment: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={feedbackToUpdate.rating}
                  min="1"
                  max="5"
                  onChange={(e) =>
                    setFeedbackToUpdate({
                      ...feedbackToUpdate,
                      rating: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700"
              >
                Update Feedback
              </button>
            </form>

            
            <button
              onClick={handleCloseModal}
              className="bg-gray-500 text-white py-2 px-4 rounded mt-4 ml-2 hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackList;
