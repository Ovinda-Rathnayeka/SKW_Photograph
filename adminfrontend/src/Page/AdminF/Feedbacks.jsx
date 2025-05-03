import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchCustomerById } from "../../API/UserAPI/CustomerAPI.js";
import Swal from "sweetalert2";
import Navbar from "../../components/AdminF/Navbar.jsx";
import Sidebar from "../../components/AdminF/Sidebar.jsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../components/images/logo.png";

const isSpamComment = (text) => {
  if (!text || text.length < 3) return false;

  const cleanedText = text.toLowerCase().replace(/\s/g, "");

  // Detect gibberish: mostly non-alphabetic or symbol-heavy
  const symbolPattern = /[^a-zA-Z0-9\s]{3,}/.test(text); // symbols like ;o/o;
  const gibberishPattern = /^[bcdfghjklmnpqrstvwxyz]{6,}$/i.test(cleanedText); // consonant-heavy

  // Detect profanity
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
  const containsBadWord = badWords.some((word) => cleanedText.includes(word));

  return symbolPattern || gibberishPattern || containsBadWord;
};

// Skeleton row component
const FeedbackSkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </td>
    ))}
  </tr>
);

function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [customerMap, setCustomerMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filterApproval, setFilterApproval] = useState("");
  const [showSpamOnly, setShowSpamOnly] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/feedbacks");
        const data = response.data.feedbacks || response.data || [];

        const sortedData = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setFeedbacks(sortedData);
        setFilteredFeedbacks(sortedData);

        const customerIds = [
          ...new Set(
            data.map((fb) => fb.customerId?.toString()).filter(Boolean)
          ),
        ];

        const customers = await Promise.all(
          customerIds.map((id) => fetchCustomerById(id).catch(() => null))
        );

        const customerMapObj = {};
        customers.forEach((c) => {
          if (c && c._id) customerMapObj[c._id] = c;
        });

        setCustomerMap(customerMapObj);
      } catch (err) {
        console.error(err);
        setError("Failed to load feedbacks.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const keyword = searchTerm.trim().toLowerCase();

    const filtered = feedbacks.filter((fb) => {
      const matchSearch =
        !keyword ||
        fb.title.toLowerCase().includes(keyword) ||
        fb.comment.toLowerCase().includes(keyword);

      const matchDate =
        !filterDate ||
        (fb.createdAt && fb.createdAt.slice(0, 10) === filterDate);

      const matchCategory = !filterCategory || fb.category === filterCategory;

      const matchApproval =
        !filterApproval ||
        (filterApproval === "approved" && fb.isApproved) ||
        (filterApproval === "pending" && !fb.isApproved);

      return matchSearch && matchDate && matchCategory && matchApproval;
    });

    setFilteredFeedbacks(filtered);
  }, [searchTerm, feedbacks, filterDate, filterCategory, filterApproval]);

  const handleDelete = async (id) => {
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
          await axios.delete(`http://localhost:5000/feedbacks/${id}`);
          const updated = feedbacks.filter((fb) => fb._id !== id);
          setFeedbacks(updated);
          setFilteredFeedbacks(updated);

          Swal.fire({
            title: "Deleted!",
            text: "Feedback has been deleted.",
            icon: "success",
          });
        } catch (err) {
          console.error("Delete failed:", err);
          Swal.fire("Error", "Failed to delete feedback.", "error");
        }
      }
    });
  };

  const handleApprove = async (id, isSpam) => {
    if (isSpam) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This feedback looks like spam. Are you sure you want to approve it for public view?",
        icon: "warning",
        width: 600,
        padding: "2em",
        color: "#000000",
        backdrop: `rgba(210, 105, 105, 0.47)`,
        showCancelButton: true,
        confirmButtonText: "Yes, I'm sure",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
      });

      if (!result.isConfirmed) return;
    }

    try {
      await axios.patch(`http://localhost:5000/feedbacks/${id}/approve`);
      const updated = feedbacks.map((fb) =>
        fb._id === id ? { ...fb, isApproved: true } : fb
      );
      setFeedbacks(updated);
      setFilteredFeedbacks(updated);

      Swal.fire({
        title: "Approved!",
        text: "Feedback has been successfully approved.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error("Approval failed:", err);
      Swal.fire("Error", "Failed to approve feedback.", "error");
    }
  };

  const getBase64FromImage = (imgPath) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imgPath;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = (err) => reject(err);
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    let y = 10;

    // 1. HEADER SECTION
    const companyName = "SKW Photography";
    const address = "1234 Main St, Colombo, Sri Lanka";
    const phone = "+94 77 123 4567";

    const logoBase64 = await getBase64FromImage(logo);

    const img = new Image();
    img.src = logoBase64;

    await new Promise((resolve) => {
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const imgHeight = 25;
        const imgWidth = aspectRatio * imgHeight;

        // Draw header background
        doc.setFillColor(0, 0, 0);
        doc.rect(10, y, 190, 30, "F");

        // Add logo
        doc.addImage(logoBase64, "PNG", 14, y + 3, imgWidth, imgHeight);

        // Add company info to the right of the logo
        const infoX = 14 + imgWidth + 60; // position to the right of the logo
        const infoY = y + 10;

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.text(companyName, infoX, infoY);

        doc.setFontSize(10);
        doc.text(address, infoX, infoY + 6);
        doc.text(`Phone: ${phone}`, infoX, infoY + 12);

        y += 40;
        resolve();
      };
    });

    // SECTION: Report Title
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Feedback Report", 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, y);
    y += 10;

    // SECTION: Analytics
    const total = filteredFeedbacks.length;
    const approved = filteredFeedbacks.filter((f) => f.isApproved).length;
    const pending = total - approved;

    const avg = (field) => {
      const vals = filteredFeedbacks.map((f) => f[field] || 0);
      return vals.length
        ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)
        : "0.00";
    };

    doc.setFont(undefined, "bold");
    doc.setFontSize(11);
    doc.text("Analytics Summary", 14, y);
    doc.setFont(undefined, "normal");
    y += 6;
    doc.text(`Total Feedbacks: ${total}`, 14, y);
    y += 5;
    doc.text(`Approved: ${approved} | Pending: ${pending}`, 14, y);
    y += 5;
    doc.text(
      `Avg - Overall: ${avg("rating")}, Service: ${avg(
        "serviceQuality"
      )}, Response: ${avg("responseTime")}, Value: ${avg(
        "valueForMoney"
      )}, Experience: ${avg("overallExperience")}`,
      14,
      y,
      { maxWidth: 180 }
    );
    y += 10;

    // SECTION: Feedback List
    filteredFeedbacks.forEach((fb, index) => {
      if (y > 260) {
        doc.addPage();
        y = 10;
      }

      const email = fb?.email || customerMap[fb.customerId]?.email || "N/A";
      const comment = fb.comment || "-";

      doc.setFont(undefined, "bold");
      doc.text(`#${index + 1}`, 14, y);
      doc.setFont(undefined, "normal");

      doc.text(`Email: ${email}`, 25, y);
      y += 6;
      doc.text(`Category: ${fb.category || "-"}`, 25, y);
      y += 6;
      doc.text(`Title: ${fb.title || "-"}`, 25, y);
      y += 6;

      const splitComment = doc.splitTextToSize(`Comment: ${comment}`, 170);
      doc.text(splitComment, 25, y);
      y += splitComment.length * 5;

      doc.text(
        `Ratings - Overall: ${fb.rating || 0}, Service: ${
          fb.serviceQuality || 0
        }, Response: ${fb.responseTime || 0}, Value: ${
          fb.valueForMoney || 0
        }, Experience: ${fb.overallExperience || 0}`,
        25,
        y
      );
      y += 6;

      doc.text(`Date: ${new Date(fb.createdAt).toLocaleDateString()}`, 25, y);
      y += 10;
    });

    doc.save("Feedback_Report.pdf");
  };

  return (
    <div className="flex">
      <Sidebar /> {/* Sidebar on the left */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-100">
        <Navbar /> {/* Navbar on the top */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-6 text-blue-800">
            All Feedbacks
          </h1>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by title or comment..."
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select
              className="px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring"
              value={filterApproval}
              onChange={(e) => setFilterApproval(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Package">Package</option>
              <option value="Rental">Rental</option>
              <option value="Purchase">Purchase</option>
              <option value="Service">Service</option>
            </select>

            <button
              onClick={() => {
                if (showSpamOnly) {
                  // Show all feedbacks again
                  setFilteredFeedbacks(feedbacks);
                } else {
                  // Filter only spam
                  const spam = feedbacks.filter(
                    (fb) => isSpamComment(fb.title) || isSpamComment(fb.comment)
                  );
                  setFilteredFeedbacks(spam);
                }
                setShowSpamOnly((prev) => !prev);
              }}
              className={`px-4 py-2 rounded shadow-sm transition ${
                showSpamOnly
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {showSpamOnly ? "View All Comments" : "Show Spam Comments"}
            </button>

            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring"
            />

            {filterDate || filterCategory || filterApproval || showSpamOnly ? (
              <button
                onClick={() => {
                  setFilterDate("");
                  setFilterCategory("");
                  setFilterApproval("");
                  setShowSpamOnly(false);
                  setFilteredFeedbacks(feedbacks); // reset feedback list
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Clear Filters
              </button>
            ) : null}
            <button
              onClick={generatePDF}
              className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
            >
              Download Report
            </button>
          </div>
          
          {loading ? (
            <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    {[...Array(8)].map((_, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 text-left text-sm font-semibold"
                      >
                        Loading...
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <FeedbackSkeletonRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredFeedbacks.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      <center>Customer Email</center>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      <center>Category</center>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      <center>Title</center>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      <center>Comment</center>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      <center>Ratings</center>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      <center>Date</center>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      <center>Actions</center>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {filteredFeedbacks.map((fb) => {
                    const customer = customerMap[fb.customerId];
                    const isSpam =
                      isSpamComment(fb.comment) || isSpamComment(fb.title);
                    return (
                      <tr
                        key={fb._id}
                        className={`transition relative ${
                          isSpam
                            ? "bg-red-100 hover:bg-red-200"
                            : "hover:bg-gray-50"
                        }`}
                        style={
                          isSpam ? { boxShadow: "inset 4px 0 0 0 #f87171" } : {}
                        }
                      >
                        <td className="px-6 py-4 text-sm">
                          {customer?.email || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm">{fb.category}</td>
                        <td className="px-6 py-4 text-sm">{fb.title}</td>
                        <td className="px-6 py-4 text-sm max-w-xs">
                          <p className="truncate">{fb.comment}</p>
                          {isSpam && (
                            <p className="text-xs text-red-600 mt-1">
                              Spam feedback detected
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-4 text-sm leading-5">
                          <div>
                            <strong>Overall:</strong> {fb.rating}
                          </div>
                          <div>
                            <strong>Service:</strong> {fb.serviceQuality || 0}
                          </div>
                          <div>
                            <strong>Response:</strong> {fb.responseTime || 0}
                          </div>
                          <div>
                            <strong>Value:</strong> {fb.valueForMoney || 0}
                          </div>
                          <div>
                            <strong>Experience:</strong>{" "}
                            {fb.overallExperience || 0}{" "}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm">
                          {fb.createdAt
                            ? new Date(fb.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm space-y-2">
                          {!fb.isApproved ? (
                            <button
                              onClick={() => handleApprove(fb._id, isSpam)}
                              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition w-full"
                            >
                              Approve
                            </button>
                          ) : (
                            <span className="text-green-600 font-medium block text-center">
                              Approved
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setSelectedFeedback(fb);
                              setViewModal(true);
                            }}
                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition w-full mb-1"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleDelete(fb._id)}
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition w-full"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {viewModal && selectedFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-8 rounded-xl shadow-2xl w-[90%] max-w-4xl">
                    <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
                      Feedback Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
                      <div>
                        <p className="mb-2">
                          <strong>Customer ID:</strong>{" "}
                          {selectedFeedback.customerId}
                        </p>
                        <p className="mb-2">
                          <strong>Title:</strong> {selectedFeedback.title}
                        </p>
                        <p className="mb-2">
                          <strong>Comment:</strong> {selectedFeedback.comment}
                        </p>
                        <p className="mb-2">
                          <strong>Category:</strong> {selectedFeedback.category}
                        </p>
                        <p className="mb-2">
                          <strong>Status:</strong>{" "}
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              selectedFeedback.isApproved
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {selectedFeedback.isApproved
                              ? "Approved"
                              : "Pending"}
                          </span>
                        </p>
                        <p className="mb-2">
                          <strong>Date:</strong>{" "}
                          {new Date(
                            selectedFeedback.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>Overall Rating:</strong>{" "}
                          {"⭐".repeat(selectedFeedback.rating || 0)}
                        </p>
                        <p>
                          <strong>Service Quality:</strong>{" "}
                          {"⭐".repeat(selectedFeedback.serviceQuality || 0)}
                        </p>
                        <p>
                          <strong>Response Time:</strong>{" "}
                          {"⭐".repeat(selectedFeedback.responseTime || 0)}
                        </p>
                        <p>
                          <strong>Value for Money:</strong>{" "}
                          {"⭐".repeat(selectedFeedback.valueForMoney || 0)}
                        </p>
                        <p>
                          <strong>Overall Experience:</strong>{" "}
                          {"⭐".repeat(selectedFeedback.overallExperience || 0)}
                        </p>
                      </div>
                    </div>

                    {selectedFeedback.images?.length > 0 && (
                      <div className="mt-6">
                        <strong className="block mb-2 text-gray-800">
                          Attached Images:
                        </strong>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedFeedback.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`feedback-${idx}`}
                              className="w-full h-40 object-cover rounded border shadow"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-8 text-right">
                      <button
                        onClick={() => {
                          setSelectedFeedback(null);
                          setViewModal(false);
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">No feedbacks found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feedbacks;