import React, { useEffect, useState } from "react";
import { fetchUserDetails } from "../Api/AuthAPI";
import axios from "axios";
import Swal from "sweetalert2";
import dot from "../components/images/dot.jpg";

function Feedback() {
  const [user, setUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const u = await fetchUserDetails();
        setUser(u);

        const res = await axios.get("http://localhost:5000/feedbacks");
        const all = res.data.feedbacks || res.data || [];

        const mine = all.filter((fb) => {
          const id = fb.customerId?._id || fb.customerId;
          return id === u._id;
        });

        setFeedbacks(mine);
      } catch (err) {
        console.error(err);
        setError("Failed to load feedbacks.");
      }
    };

    loadData();
  }, []);

  const viewFeedback = (fb) => {
    const html = `
      <div style="
        background-color: #1f2937;
        color: #e5e7eb;
        padding: 20px;
        border-radius: 10px;
        font-family: 'Segoe UI', sans-serif;
        font-size: 14px;
        line-height: 1.7;
        text-align: left;
      ">
  
        <div style="margin-bottom: 16px;">
          <h2 style="font-size: 20px; color: #f97316; margin: 0;">📝 ${fb.title}</h2>
          <p style="margin: 4px 0 0; color: #9ca3af;">${fb.category}</p>
        </div>
  
        <div style="margin-bottom: 20px;">
          <strong style="color: #f97316;">💬 Comment:</strong>
          <p style="margin: 4px 0 0;">${fb.comment}</p>
        </div>
  
        <div style="
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 20px;
        ">
          <div><strong>⭐ Overall:</strong> ${fb.rating}</div>
          <div><strong>⚙️ Service:</strong> ${fb.serviceQuality}</div>
          <div><strong>⏱️ Response:</strong> ${fb.responseTime}</div>
          <div><strong>💸 Value:</strong> ${fb.valueForMoney}</div>
          <div><strong>🌟 Experience:</strong> ${fb.overallExperience}</div>
        </div>
  
        ${
          fb.images?.length
            ? `
          <div>
            <strong style="color: #f97316;">🖼️ Uploaded Images:</strong>
            <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 10px;">
              ${fb.images
                .map(
                  (img) => `
                  <img 
                    src="${img}" 
                    style="
                      width: 80px; 
                      height: 80px; 
                      object-fit: cover; 
                      border-radius: 8px; 
                      border: 1px solid #374151;
                    "
                  />
                `
                )
                .join("")}
            </div>
          </div>
          `
            : `<p style="margin-top: 16px; color: #9ca3af;">No images uploaded.</p>`
        }
      </div>
    `;
  
    Swal.fire({
      title: "",
      html,
      background: "#111827",
      color: "#e5e7eb",
      showConfirmButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#f97316",
      width: 700,
      customClass: {
        popup: "rounded-xl shadow-2xl",
      },
    });
  };
  

  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!user)
    return <div className="text-white text-center mt-8">Loading…</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center px-4 py-20 pt-28"
      style={{ backgroundImage: `url(${dot})` }}
    >
      <div className="max-w-6xl mx-auto bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-8">
        <h2 className="text-4xl font-bold text-center text-orange-500 mb-8 drop-shadow">
          My Feedbacks
        </h2>

        {feedbacks.length === 0 ? (
          <p className="text-center text-white text-lg bg-[#1f2937]/70 py-4 rounded-lg">
            No feedbacks found.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm text-center bg-white/80 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-[#1f2937] text-white uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Rating</th>
                  <th className="px-6 py-3">Comment</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 font-medium">
                {feedbacks.map((fb) => (
                  <tr
                    key={fb._id}
                    className="border-b hover:bg-orange-50 transition duration-200"
                  >
                    <td className="px-6 py-4">{fb.title}</td>
                    <td className="px-6 py-4">{fb.category}</td>
                    <td className="px-6 py-4">{fb.rating}⭐</td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      {fb.comment}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewFeedback(fb)}
                        className="bg-orange-500 text-white px-4 py-1 rounded-lg shadow hover:bg-orange-600 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;
