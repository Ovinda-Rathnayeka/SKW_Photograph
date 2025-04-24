import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import feedbackAPI from "../Api/FeedbackAPI";
import { fetchUserDetails } from "../Api/AuthAPI";
import dot from "../components/images/dot.jpg";

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
        const approved = feedbackData.filter((f) => f.isApproved); // ✅ Only show approved feedbacks
        setFeedbacks(approved);
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
      else if (!/^[a-zA-Z0-9 ]+$/.test(value))
        error = "Title must not contain special characters.";
    }
    if (field === "comment") {
      if (!value.trim()) error = "Comment is required.";
      else if (value.length > 100)
        error = "Comment cannot exceed 100 characters.";
    }
    if (
      [
        "serviceQuality",
        "responseTime",
        "valueForMoney",
        "overallExperience",
      ].includes(field)
    ) {
      if (!/^[1-5]$/.test(value)) error = "Rating must be between 1 and 5.";
    }
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const {
      title,
      comment,
      serviceQuality,
      responseTime,
      valueForMoney,
      overallExperience,
    } = feedbackToUpdate;

    const titleValid = title?.trim() && /^[a-zA-Z0-9 ]+$/.test(title);
    const commentValid = comment?.trim() && comment.length <= 100;
    const ratingsValid =
      /^[1-5]$/.test(serviceQuality) &&
      /^[1-5]$/.test(responseTime) &&
      /^[1-5]$/.test(valueForMoney) &&
      /^[1-5]$/.test(overallExperience);

    return titleValid && commentValid && ratingsValid;
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
      feedbackToUpdate.isApproved = false; // Force re-approval on update
      await feedbackAPI.updateFeedbackById(
        feedbackToUpdate._id,
        feedbackToUpdate
      );
      setFeedbacks((prev) =>
        prev.filter((f) => f._id !== feedbackToUpdate._id)
      );

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your Feedback will be updated after admin approval.",
        showConfirmButton: false,
        timer: 2000,
      });
      setShowModal(false);
    } catch {
      setError("Error updating feedback.");
    }
  };

  const packages = feedbacks.filter((f) => f.category === "Package");
  const purchases = feedbacks.filter((f) => f.category === "Purchase");
  const rentals = feedbacks.filter((f) => f.category === "Rental");
  const services = feedbacks.filter((f) => f.category === "Service");

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const renderFeedbackSection = (title, items) => (
    <div id={title.toLowerCase()} className="mb-12">
      <h2 className="text-white text-2xl font-bold mb-4">{title}</h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((feedback) => (
            <div
              key={feedback._id}
              className="relative bg-white/80 backdrop-blur-lg border border-transparent rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.025] hover:border-blue-400 h-full"
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {feedback.title}
                  </h2>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
                    <p>
                      <strong>Service Quality:</strong> <br />
                      <span className="text-yellow-500 text-2xl">
                        {"★".repeat(feedback.serviceQuality || 0)}
                      </span>
                    </p>
                    <p>
                      <strong>Response Time:</strong> <br />
                      <span className="text-yellow-500 text-2xl">
                        {"★".repeat(feedback.responseTime || 0)}
                      </span>
                    </p>
                    <p>
                      <strong>Value for Money:</strong> <br />
                      <span className="text-yellow-500 text-2xl">
                        {"★".repeat(feedback.valueForMoney || 0)}
                      </span>
                    </p>
                    <p>
                      <strong>Overall:</strong> <br />
                      <span className="text-yellow-500 text-2xl">
                        {"★".repeat(feedback.overallExperience || 0)}
                      </span>
                    </p>
                  </div>

                  <p className="text-md font-medium text-blue-600 mb-1">
                    {feedback.category}
                  </p>
                  <p className="text-gray-700 mb-4">{feedback.comment}</p>

                  <div className="flex flex-wrap gap-4 mb-4">
                    {feedback.images && feedback.images.length > 0 ? (
                      feedback.images.map((image, index) => (
                        <div
                          key={index}
                          className="w-28 h-28 bg-gray-200 rounded-lg overflow-hidden border border-gray-300"
                        >
                          <img
                            src={image}
                            alt={`feedback-img-${index}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-black-400 text-sm">
                        No images available
                      </p>
                    )}
                  </div>
                </div>

                {userId && feedback.customerId === userId && (
                  <div className="flex justify-center gap-10 mt-4">
                    <button
                      onClick={() => handleOpenModal(feedback)}
                      className="bg-yellow-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(feedback._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white">No feedback available.</p>
      )}
    </div>
  );

  if (loading)
    return (
      <div className="text-center p-6 text-white">Loading feedbacks...</div>
    );
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${dot})`,
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold mb-6 text-white">All Feedback</h1>

        {userId && (
          <Link to="/add-feedback">
            <button className="bg-blue-500 text-white py-2 px-4 rounded mb-6 hover:bg-blue-700">
              Add Feedback
            </button>
          </Link>
        )}

        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          {["Package", "Purchase", "Rental", "Service"].map((type) => (
            <button
              key={type}
              onClick={() => scrollToSection(type.toLowerCase())}
              className="bg-white/80 text-blue-700 px-4 py-2 rounded-lg shadow hover:bg-white hover:shadow-lg transition"
            >
              {type}
            </button>
          ))}
        </div>

        {renderFeedbackSection("Package", packages)}
        {renderFeedbackSection("Purchase", purchases)}
        {renderFeedbackSection("Rental", rentals)}
        {renderFeedbackSection("Service", services)}

        {/* Modal for update */}
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
                  {formErrors.title && (
                    <p className="text-red-500 text-sm">{formErrors.title}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-2">Comment</label>
                  <textarea
                    value={feedbackToUpdate.comment}
                    onChange={(e) =>
                      handleInputChange("comment", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  {formErrors.comment && (
                    <p className="text-red-500 text-sm">{formErrors.comment}</p>
                  )}
                </div>

                {/* ⭐ New Rating Inputs */}
                {[
                  { label: "Service Quality", field: "serviceQuality" },
                  { label: "Response Time", field: "responseTime" },
                  { label: "Value for Money", field: "valueForMoney" },
                  { label: "Overall Experience", field: "overallExperience" },
                ].map(({ label, field }) => (
                  <div className="mb-4" key={field}>
                    <label className="block mb-2">{label}</label>
                    <select
                      value={feedbackToUpdate[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select rating</option>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>
                          {value} ★
                        </option>
                      ))}
                    </select>
                    {formErrors[field] && (
                      <p className="text-red-500 text-sm">
                        {formErrors[field]}
                      </p>
                    )}
                  </div>
                ))}

                <div className="flex justify-center gap-4 mt-6">
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
    </div>
  );
}

export default FeedbackList;
