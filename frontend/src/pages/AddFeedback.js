import React, { useState, useEffect } from "react";
import feedbackAPI from "../Api/FeedbackAPI";
import { fetchUserDetails } from "../Api/AuthAPI";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import dot from "../components/images/dot.jpg";
=======
>>>>>>> main

function AddFeedback() {
  const history = useNavigate();
  const [feedbackData, setFeedbackData] = useState({
    category: "",
    rating: "",
    title: "",
    comment: "",
    serviceQuality: "",
    responseTime: "",
    valueForMoney: "",
    overallExperience: "",
  });

  const [images, setImages] = useState([]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await fetchUserDetails();
        setCustomerEmail(userDetails.email);
        setCustomerId(userDetails._id);
      } catch (err) {
        setError("Error fetching customer details.");
      }
    };
    fetchUser();
  }, []);

<<<<<<< HEAD
  const validate = (name, value) => {
    let errors = { ...validationErrors };

    if (name === "category") {
      errors.category = value.trim() === "" ? "Category is required." : "";
    }

    if (name === "title") {
      if (value.trim() === "") {
        errors.title = "Title is required.";
      } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
        errors.title = "Title cannot contain special characters.";
      } else {
        errors.title = "";
      }
    }

    if (name === "comment") {
      const plainText = value.replace(/[^a-zA-Z]/g, "");
      errors.comment =
        plainText.length > 100 ? "Comment must not exceed 100 letters." : "";
    }

    if (["rating", "serviceQuality", "responseTime", "valueForMoney", "overallExperience"].includes(name)) {
      errors[name] = !/^[1-5]$/.test(value) ? "Please select a rating between 1 and 5." : "";
    }

    setValidationErrors(errors);
  };

=======
>>>>>>> main
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    const isValid = selectedFiles.every((file) =>
      allowedTypes.includes(file.type)
    );
    let errors = { ...validationErrors };
    errors.images = isValid ? "" : "Only JPG, JPEG, PNG files are allowed.";
    setValidationErrors(errors);

    if (isValid) setImages(selectedFiles);
    else setImages([]);
  };

  const isFormValid = () => {
    const letterCount = feedbackData.comment.replace(/[^a-zA-Z]/g, "").length;

    const allRatingsValid = ["rating", "serviceQuality", "responseTime", "valueForMoney", "overallExperience"]
      .every((field) => /^[1-5]$/.test(feedbackData[field]));

    return (
      feedbackData.category &&
      feedbackData.title &&
      letterCount > 0 &&
      letterCount <= 100 &&
      allRatingsValid &&
      Object.values(validationErrors).every((err) => err === "")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

<<<<<<< HEAD
=======
    console.log("Feedback Data: ", {
      ...feedbackData,
      customerEmail,
      customerId,
    });

>>>>>>> main
    try {
      if (!customerId) {
        setError("Customer ID is missing.");
        setLoading(false);
        return;
      }

      const feedbackWithCustomer = {
        ...feedbackData,
        customerEmail,
        customerId,
      };

      await feedbackAPI.createFeedback(feedbackWithCustomer, images);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your feedback will approve soon!",
        showConfirmButton: false,
        timer: 1500,
      });

      setFeedbackData({
        category: "",
        rating: "",
        title: "",
        comment: "",
        serviceQuality: "",
        responseTime: "",
        valueForMoney: "",
        overallExperience: "",
      });
      setImages([]);
      history("/feedbacks");
    } catch (err) {
      setError("Failed to add feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: `url(${dot})` }}
    >
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
          Add Feedback
        </h1>

        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block mb-2">Customer Email</label>
            <input
              type="email"
              value={customerEmail}
              disabled
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block mb-2">Category</label>
            <select
              name="category"
              value={feedbackData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a category</option>
              <option value="Service">Service</option>
              <option value="Purchase">Purchase</option>
              <option value="Package">Package</option>
              <option value="Rental">Rental</option>
            </select>
            {validationErrors.category && (
              <p className="text-red-500 text-sm">{validationErrors.category}</p>
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={feedbackData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {validationErrors.title && (
              <p className="text-red-500 text-sm">{validationErrors.title}</p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block mb-2">Comment</label>
            <textarea
              name="comment"
              value={feedbackData.comment}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {validationErrors.comment && (
              <p className="text-red-500 text-sm">{validationErrors.comment}</p>
            )}
          </div>

          {/* Ratings */}
          {[
            { key: "rating", label: "Overall Rating" },
            { key: "serviceQuality", label: "Service Quality" },
            { key: "responseTime", label: "Response Time" },
            { key: "valueForMoney", label: "Value for Money" },
            { key: "overallExperience", label: "Overall Experience" },
          ].map(({ key, label }) => (
            <div key={key} className="mb-4">
              <label className="block mb-2">{label}</label>
              <select
                name={key}
                value={feedbackData[key]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select</option>
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              {validationErrors[key] && (
                <p className="text-red-500 text-sm">{validationErrors[key]}</p>
              )}
            </div>
          ))}

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block mb-2">Upload Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {validationErrors.images && (
              <p className="text-red-500 text-sm">{validationErrors.images}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={!isFormValid() || loading}
          >
            {loading ? "Adding Feedback..." : "Add Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddFeedback;
