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
  const [originalFeedback, setOriginalFeedback] = useState(null);
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
        const approved = feedbackData.filter((f) => f.isApproved);
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

  const isSpam = (text) => {
    const badWords = [
      "spam",
      "scam",
      "fake",
      "fraud",
      "stupid",
      "idiot",
      "nonsense",
      "damn",
      "crap",
      "hell",
      "shit",
      "fuck",
      "bitch",
      "bastard",
      "asshole",
      "retard",
      "dick",
      "piss",
      "slut",
      "moron",
      "suck",
      "nigger",
      "whore",
      "cunt",
    ];

    const lowerText = text.toLowerCase();
    const randomPattern = /([a-zA-Z])\1{4,}|[^a-zA-Z0-9\s]{4,}|([bcdfghjklmnpqrstvwxyz]{5,}|[aeiou]{5,})/g;
    const containsBadWords = badWords.some((word) => lowerText.includes(word));

    return randomPattern.test(lowerText) || containsBadWords;
  };

  const validateField = (field, value) => {
    let error = "";
    if (["title", "comment"].includes(field)) {
      if (!value.trim()) error = "This field is required.";
      else if (value.length > 100) error = "Max 100 characters.";
      else if (isSpam(value)) error = "Spam content detected.";
    }
<<<<<<< HEAD
    if (field === "rating") {
      if (!/^[1-5]$/.test(value))
        error = "Rating must be a whole number between 1 and 5.";
=======

    if (
      [
        "rating",
        "serviceQuality",
        "responseTime",
        "valueForMoney",
        "overallExperience",
      ].includes(field)
    ) {
      if (!/^[1-5]$/.test(value)) error = "Select value 1-5.";
>>>>>>> pinidu_backup
    }

    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
<<<<<<< HEAD
    const { title, comment, rating } = feedbackToUpdate;
    return (
      title.trim() &&
      /^[a-zA-Z0-9 ]+$/.test(title) &&
      comment.trim() &&
      comment.length <= 100 &&
      /^[1-5]$/.test(rating)
    );
=======
    if (!feedbackToUpdate || !originalFeedback) return false;

    const changed = Object.keys(feedbackToUpdate).some(
      (key) => feedbackToUpdate[key] !== originalFeedback[key]
    );

    const requiredFields = [
      "title",
      "comment",
      "rating",
      "serviceQuality",
      "responseTime",
      "valueForMoney",
      "overallExperience",
    ];

    const allFilled = requiredFields.every(
      (key) => feedbackToUpdate[key]?.toString().trim() !== ""
    );

    const noErrors = Object.values(formErrors).every((err) => err === "");

    return changed && allFilled && noErrors;
>>>>>>> pinidu_backup
  };

  const handleInputChange = (field, value) => {
    setFeedbackToUpdate((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleDelete = async (feedbackId) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await feedbackAPI.deleteFeedbackById(feedbackId);
          setFeedbacks((prev) => prev.filter((f) => f._id !== feedbackId));
          Swal.fire("Deleted!", "", "success");
        } catch {
          setError("Error deleting feedback.");
        }
      }
    });
  };

  const handleOpenModal = (feedback) => {
    setFeedbackToUpdate({ ...feedback });
    setOriginalFeedback({ ...feedback });
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFeedbackToUpdate(null);
    setOriginalFeedback(null);
  };

  const handleUpdateFeedback = async () => {
    if (!validateForm()) return;
    try {
<<<<<<< HEAD
=======
      feedbackToUpdate.isApproved = false;
>>>>>>> pinidu_backup
      await feedbackAPI.updateFeedbackById(
        feedbackToUpdate._id,
        feedbackToUpdate
      );
      setFeedbacks((prev) =>
        prev.map((f) =>
          f._id === feedbackToUpdate._id ? { ...f, ...feedbackToUpdate } : f
        )
      );
<<<<<<< HEAD
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your Feedback has been updated",
        showConfirmButton: false,
        timer: 1500,
      });
=======
      Swal.fire("Updated!", "Your feedback is awaiting approval.", "success");
>>>>>>> pinidu_backup
      setShowModal(false);
    } catch {
      setError("Error updating feedback.");
    }
  };

  const renderStars = (count) => "★".repeat(count);

  const renderFeedbackSection = (title, items) => (
    <div id={title.toLowerCase()} className="mb-12">
      <h2 className="text-white text-2xl font-bold mb-4">{title}</h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((feedback) => (
            <div
              key={feedback._id}
<<<<<<< HEAD
              className="relative bg-white/80 backdrop-blur-lg border border-transparent rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.025] hover:border-blue-400"
            >
              <div className="absolute inset-0 rounded-2xl border border-white/20 shadow-inner pointer-events-none"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {feedback.title}
              </h2>
              <div className="flex items-center mb-3">
                <span className="text-yellow-500 text-lg">
                  {"★".repeat(feedback.rating)}{" "}
                  {"☆".repeat(5 - feedback.rating)}
                </span>
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
                  <p className="text-black-400 text-sm">No images available</p>
                )}
              </div>
              {userId && feedback.customerId === userId && (
                <div className="flex justify-center gap-10 pt-2">
                  <button
                    onClick={() => handleOpenModal(feedback)}
                    className="bg-yellow-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
=======
              className="relative bg-white/80 backdrop-blur-lg border border-transparent rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.025] hover:border-blue-400 h-full flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {feedback.title}
                </h2>
                <div className="flex flex-col gap-1 text-sm text-gray-700 mb-3">
                  <p>
                    Overall Rating:{" "}
                    <span className="text-yellow-500 text-2xl">
                      {renderStars(feedback.rating)}
                    </span>
                  </p>
                  <p>
                    Service Quality:{" "}
                    <span className="text-yellow-500 text-2xl">
                      {renderStars(feedback.serviceQuality || 0)}
                    </span>
                  </p>
                  <p>
                    Response Time:{" "}
                    <span className="text-yellow-500 text-2xl">
                      {renderStars(feedback.responseTime || 0)}
                    </span>
                  </p>
                  <p>
                    Value for Money:{" "}
                    <span className="text-yellow-500 text-2xl">
                      {renderStars(feedback.valueForMoney || 0)}
                    </span>
                  </p>
                  <p>
                    Overall Experience:{" "}
                    <span className="text-yellow-500 text-2xl">
                      {renderStars(feedback.overallExperience || 0)}
                    </span>
                  </p>
                </div>

                <p className="text-blue-600 font-medium">{feedback.category}</p>
                <p className="text-gray-700 mb-3">{feedback.comment}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {feedback.images?.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`img-${idx}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
              {userId === feedback.customerId && (
                <div className="flex justify-center gap-4 mt-auto">
                  <button
                    onClick={() => handleOpenModal(feedback)}
                    className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
>>>>>>> pinidu_backup
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(feedback._id)}
<<<<<<< HEAD
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
=======
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
>>>>>>> pinidu_backup
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white">No feedback available.</p>
      )}
    </div>
  );

  const grouped = {
    Package: feedbacks.filter((f) => f.category === "Package"),
    Purchase: feedbacks.filter((f) => f.category === "Purchase"),
    Rental: feedbacks.filter((f) => f.category === "Rental"),
    Service: feedbacks.filter((f) => f.category === "Service"),
  };

  if (loading)
<<<<<<< HEAD
    return (
      <div className="text-center p-6 text-white">Loading feedbacks...</div>
    );
  if (error)
    return <div className="text-center p-6 text-red-600">{error}</div>;
=======
    return <div className="text-center p-6 text-white">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;
>>>>>>> pinidu_backup

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${dot})` }}
    >
      <div className="max-w-7xl mx-auto p-6">
<<<<<<< HEAD
        <h1 className="text-3xl font-semibold mb-6 text-white">All Feedback</h1>

=======
        <h1 className="text-3xl text-white font-bold mb-6">All Feedback</h1>
>>>>>>> pinidu_backup
        {userId && (
          <Link to="/add-feedback">
            <button className="bg-blue-500 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700">
              Add Feedback
            </button>
          </Link>
        )}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {Object.keys(grouped).map((type) => (
            <button
              key={type}
              onClick={() =>
                document
                  .getElementById(type.toLowerCase())
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white/80 text-blue-700 px-4 py-2 rounded-lg hover:bg-white shadow"
            >
              {type}
            </button>
          ))}
        </div>

        {Object.entries(grouped).map(([type, items]) =>
          renderFeedbackSection(type, items)
        )}

        {showModal && feedbackToUpdate && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-60 flex items-center justify-center z-50">
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
<<<<<<< HEAD
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
                    onChange={(e) =>
                      handleInputChange("title", e.target.value)
                    }
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
                    <p className="text-red-500 text-sm">
                      {formErrors.comment}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block mb-2">Rating</label>
                  <input
                    type="number"
                    value={feedbackToUpdate.rating}
                    min="1"
                    max="5"
                    step="1"
                    onChange={(e) =>
                      handleInputChange("rating", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  {formErrors.rating && (
                    <p className="text-red-500 text-sm">{formErrors.rating}</p>
                  )}
                </div>

                <div className="flex justify-center gap-4">
=======
                {["title", "comment"].map((field) => (
                  <div className="mb-4" key={field}>
                    <label className="block mb-1 capitalize">{field}</label>
                    {field === "comment" ? (
                      <textarea
                        value={feedbackToUpdate[field]}
                        onChange={(e) =>
                          handleInputChange(field, e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <input
                        type="text"
                        value={feedbackToUpdate[field]}
                        onChange={(e) =>
                          handleInputChange(field, e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    )}
                    {formErrors[field] && (
                      <p className="text-red-500 text-sm">
                        {formErrors[field]}
                      </p>
                    )}
                  </div>
                ))}

                {[
                  "rating",
                  "serviceQuality",
                  "responseTime",
                  "valueForMoney",
                  "overallExperience",
                ].map((field) => (
                  <div className="mb-4" key={field}>
                    <label className="block mb-1 capitalize">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <select
                      value={feedbackToUpdate[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      {[5, 4, 3, 2, 1].map((val) => (
                        <option key={val} value={val}>
                          {val}
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

                <div className="flex justify-center gap-4 pt-4">
>>>>>>> pinidu_backup
                  <button
                    type="submit"
                    disabled={!validateForm()}
                    className={`px-6 py-2 rounded text-white ${
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
                    className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-800"
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
