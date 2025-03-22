import React, { useEffect, useState } from "react";
import {
  fetchAllPayments,
  updatePaymentStatus,
  getPaymentWithDetails,
} from "../../API/PaymentAPI";

function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const loadAllPayments = async () => {
      try {
        const allPayments = await fetchAllPayments();
        setPayments(allPayments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAllPayments();
  }, []);

  const handleStatusUpdate = async (paymentId, status) => {
    try {
      const updatedPayment = await updatePaymentStatus(paymentId, status);
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === paymentId ? updatedPayment : payment
        )
      );
      alert(`Payment status updated to ${status}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewDetails = async (paymentId) => {
    try {
      const details = await getPaymentWithDetails(paymentId);
      console.log("Fetched payment details:", details); // 👀 Debug line

      // ✅ Ensure response has all required fields
      if (
        details &&
        details.payment &&
        details.bookingDetails &&
        details.customerDetails &&
        details.packageDetails
      ) {
        setPaymentDetails(details);
        setShowModal(true);
      } else {
        console.warn("Incomplete payment details received.");
      }
    } catch (err) {
      console.error("Error fetching payment details:", err.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPaymentDetails(null);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  if (loading)
    return (
      <div className="text-center text-lg text-slate-600">
        Loading payment details...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-lg text-red-600">Error: {error}</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
        Payment Overview
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-sm border border-slate-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              {[
                "Payment ID",
                "Amount Paid",
                "Remaining Balance",
                "Payment Type",
                "Status",
                "Method",
                "Transaction ID",
                "Proof",
                "Actions",
              ].map((heading) => (
                <th key={heading} className="px-4 py-3 border-b text-left">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const remainingBalance =
                payment.paymentType === "half"
                  ? payment.toPayAmount - payment.halfPaymentAmount
                  : 0;

              return (
                <tr
                  key={payment._id}
                  className="hover:bg-slate-50 border-b transition"
                >
                  <td className="px-4 py-2">{payment._id}</td>
                  <td className="px-4 py-2">
                    $
                    {payment.paymentType === "half"
                      ? payment.halfPaymentAmount
                      : payment.amount}
                  </td>
                  <td className="px-4 py-2">
                    {payment.paymentType === "half"
                      ? `$${remainingBalance}`
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {payment.paymentType}
                  </td>
                  <td className="px-4 py-2 text-center font-medium">
                    {payment.paymentStatus}
                  </td>
                  <td className="px-4 py-2">{payment.paymentMethod}</td>
                  <td className="px-4 py-2">{payment.transactionId}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-sky-500 hover:text-sky-700 underline underline-offset-2"
                      onClick={() => {
                        setSelectedImage(payment.proofImageUrl);
                        setShowImageModal(true);
                      }}
                    >
                      View Proof
                    </button>
                  </td>
                  <td className="px-4 py-2 flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        handleStatusUpdate(payment._id, "Completed")
                      }
                      disabled={payment.paymentStatus === "Completed"}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs rounded-md border border-emerald-300 hover:bg-emerald-200 disabled:opacity-40"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(payment._id, "Failed")}
                      disabled={payment.paymentStatus === "Failed"}
                      className="px-3 py-1.5 bg-rose-100 text-rose-700 text-xs rounded-md border border-rose-300 hover:bg-rose-200 disabled:opacity-40"
                    >
                      Fail
                    </button>
                    <button
                      onClick={() => handleViewDetails(payment._id)}
                      className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs rounded-md border border-indigo-300 hover:bg-indigo-200"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payment Details Modal */}
      {showModal && paymentDetails && paymentDetails.payment && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-700">
                Payment Details
              </h3>
              <button
                onClick={closeModal}
                className="text-rose-500 hover:text-rose-700 font-bold text-lg"
              >
                ×
              </button>
            </div>
            <div className="space-y-1 text-slate-600 text-sm">
              <p><strong>ID:</strong> {paymentDetails.payment._id}</p>
              <p><strong>Amount:</strong> ${paymentDetails.payment.amount}</p>
              <p><strong>Balance:</strong> ${paymentDetails.payment.paymentType === "half" ? paymentDetails.payment.toPayAmount - paymentDetails.payment.halfPaymentAmount : 0}</p>
              <p><strong>Booking ID:</strong> {paymentDetails.bookingDetails._id}</p>
              <p><strong>Customer:</strong> {paymentDetails.customerDetails.name}</p>
              <p><strong>Phone:</strong> {paymentDetails.customerDetails.phone}</p>
              <p><strong>NIC:</strong> {paymentDetails.customerDetails.nic}</p>
              <p><strong>Package:</strong> {paymentDetails.packageDetails.packageName}</p>
              <p><strong>Booking Date:</strong> {paymentDetails.bookingDetails.bookingDate}</p>
              <p><strong>Method:</strong> {paymentDetails.payment.paymentMethod}</p>
            </div>
            <button
              className="mt-5 w-full px-4 py-2 text-white bg-slate-600 rounded-md hover:bg-slate-700"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Proof Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-md max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-700">
                Proof Image
              </h3>
              <button
                onClick={closeImageModal}
                className="text-rose-500 hover:text-rose-700 font-bold text-lg"
              >
                ×
              </button>
            </div>
            <img
              src={selectedImage}
              alt="Proof"
              className="max-w-full max-h-[500px] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
