import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

function UpdateFeedback() {
  const [inputs, setInputs] = useState({
    user: "",
    category: "",
    title: "",
    rating: "",
    comment: "",
  });

  const history = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});

  // Fetch existing feedback
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/feedbacks/${id}`);
        setInputs(res.data.feedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };
    fetchHandler();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === "user") {
      newErrors.user = /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/.test(value)
        ? ""
        : "Name must start with a capital letter and contain only letters.";
    }
    if (name === "category") {
      newErrors.category = value ? "" : "Category must be selected.";
    }
    if (name === "title") {
      newErrors.title = value.trim() ? "" : "Title is required.";
    }
    if (name === "rating") {
      newErrors.rating = /^[1-5]$/.test(value)
        ? ""
        : "Rating must be a whole number between 1 and 5.";
    }
    if (name === "comment") {
      newErrors.comment = value.trim() ? "" : "Comment cannot be empty.";
    }

    setInputs({ ...inputs, [name]: value });
    setErrors(newErrors);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error)) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/feedbacks/${id}`, inputs);
      alert("Feedback updated successfully!");
      history("/feedbacks");
    } catch (error) {
      console.error("Error updating feedback:", error);
      alert("Failed to update feedback.");
    }
  };

  // Handle Cancel Button Click
  const handleCancel = () => {
    history("/feedbacks"); // Redirects back to feedback list
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">

      {/* Centered Form with Spacing */}
      <div className="flex-grow flex items-center justify-center mt-12 mb-16 px-4">
        <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-orange-400 text-3xl font-bold text-center mb-6">
            Update Feedback
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Input */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Your Name
              </label>
              <input
                type="text"
                name="user"
                value={inputs.user}
                onChange={handleChange}
                className={`w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.user ? "border-red-500" : ""
                }`}
                required
              />
              {errors.user && (
                <p className="text-red-500 text-sm">{errors.user}</p>
              )}
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Category
              </label>
              <select
                name="category"
                value={inputs.category}
                onChange={handleChange}
                className={`w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? "border-red-500" : ""
                }`}
                required
              >
                <option value="">Select Category</option>
                <option value="Package">📦 Package</option>
                <option value="Rental">🏠 Rental</option>
                <option value="Purchase">🛒 Purchase</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-gray-700 font-semibold">Title</label>
              <input
                type="text"
                name="title"
                value={inputs.title}
                onChange={handleChange}
                className={`w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-500" : ""
                }`}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Rating Input */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Rating (1-5)
              </label>
              <input
                type="number"
                name="rating"
                value={inputs.rating}
                onChange={handleChange}
                min="1"
                max="5"
                className={`w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.rating ? "border-red-500" : ""
                }`}
                required
              />
              {errors.rating && (
                <p className="text-red-500 text-sm">{errors.rating}</p>
              )}
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Comment
              </label>
              <textarea
                name="comment"
                value={inputs.comment}
                onChange={handleChange}
                className={`w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.comment ? "border-red-500" : ""
                }`}
                rows="4"
                required
              ></textarea>
              {errors.comment && (
                <p className="text-red-500 text-sm">{errors.comment}</p>
              )}
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              {/* Update Feedback Button */}
              <button
                type="submit"
                className={`flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto ${
                  Object.values(errors).some((error) => error)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={Object.values(errors).some((error) => error)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Update Feedback
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition w-full sm:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateFeedback;
