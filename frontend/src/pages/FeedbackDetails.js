import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import feedbackAPI from "../Api/FeedbackAPI";
import { fetchUserDetails } from "../Api/AuthAPI";

function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedbackToUpdate, setFeedbackToUpdate] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await fetchUserDetails();
        setUserId(userDetails._id);
      } catch {
        setUserId(null);
      }
    };

    const fetchAllFeedbacks = async () => {
      try {
        const feedbackData = await feedbackAPI.getAllFeedback();
        setFeedbacks(feedbackData);
        setLoading(false);
      } catch {
        setError("Error fetching feedbacks.");
        setLoading(false);
      }
    };

    fetchUser();
    fetchAllFeedbacks();
  }, []);

  const validateField = (field, value) => {
    let error = "";
    if (field === "title") {
      if (!value.trim()) error = "Title is required.";
      else if (!/^[a-zA-Z0-9 ]+$/.test(value)) error = "Title must not contain special characters.";
    }
    if (field === "comment") {
      if (!value.trim()) error = "Comment is required.";
      else if (value.length > 100) error = "Comment cannot exceed 100 characters.";
    }
    if (field === "rating") {
      if (!/^[1-5]$/.test(value)) error = "Rating must be a whole number between 1 and 5.";
    }
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const { title, comment, rating } = feedbackToUpdate;
    return (
      title.trim() &&
      /^[a-zA-Z0-9 ]+$/.test(title) &&
      comment.trim() &&
      comment.length <= 100 &&
      /^[1-5]$/.test(rating)
    );
  };

  const handleInputChange = (field, value) => {
    setFeedbackToUpdate((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleDelete = async (feedbackId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await feedbackAPI.deleteFeedbackById(feedbackId);
          setFeedbacks(feedbacks.filter((f) => f._id !== feedbackId));
          Swal.fire({
            title: "Deleted!",
            text: "Your Feedback has been deleted.",
            icon: "success",
          });
        } catch {
          setError("Error deleting feedback.");
        }
      }
    });
  };

  const handleOpenModal = (feedback) => {
    setFeedbackToUpdate(feedback);
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFeedbackToUpdate(null);
  };

  const handleUpdateFeedback = async () => {
    if (!validateForm()) return;
    try {
      await feedbackAPI.updateFeedbackById(feedbackToUpdate._id, feedbackToUpdate);
      setFeedbacks((prev) =>
        prev.map((f) => (f._id === feedbackToUpdate._id ? { ...f, ...feedbackToUpdate } : f))
      );
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your Feedback has been updated",
        showConfirmButton: false,
        timer: 1500
      });
      setShowModal(false);
    } catch {
      setError("Error updating feedback.");
    }
  };

  if (loading) return <div className="text-center p-6">Loading feedbacks...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

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
            <div key={feedback._id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-semibold mb-4">{feedback.title}</h2>
              <div className="flex items-center mb-4">
                <span className="text-yellow-500">
                  {"★".repeat(feedback.rating)}{" "}
                  {"☆".repeat(5 - feedback.rating)}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{feedback.category}</p>
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

      {/* Modal for Update */}
      {showModal && feedbackToUpdate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-[600px]">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Update Feedback
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateFeedback();
              }}
            >
              <div className="mb-4">
                <label className="block mb-2">Category</label>
                <input
                  type="text"
                  value={feedbackToUpdate.category}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  value={feedbackToUpdate.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
              </div>

              <div className="mb-4">
                <label className="block mb-2">Comment</label>
                <textarea
                  value={feedbackToUpdate.comment}
                  onChange={(e) => handleInputChange("comment", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {formErrors.comment && <p className="text-red-500 text-sm">{formErrors.comment}</p>}
              </div>

              <div className="mb-6">
                <label className="block mb-2">Rating</label>
                <input
                  type="number"
                  value={feedbackToUpdate.rating}
                  min="1"
                  max="5"
                  step="1"
                  onChange={(e) => handleInputChange("rating", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {formErrors.rating && <p className="text-red-500 text-sm">{formErrors.rating}</p>}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  type="submit"
                  disabled={!validateForm()}
                  className={`py-2 px-6 rounded text-white ${
                    validateForm()
                      ? "bg-blue-500 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Update Feedback
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackList;
