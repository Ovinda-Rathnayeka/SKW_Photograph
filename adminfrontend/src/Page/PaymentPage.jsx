import React, { useEffect, useState } from "react";
import { fetchAllPayments, updatePaymentStatus, getPaymentWithDetails } from "../API/PaymentAPI"; // Import necessary functions

function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for controlling modal visibility
  const [showImageModal, setShowImageModal] = useState(false); // State for showing proof image modal
  const [paymentDetails, setPaymentDetails] = useState(null); // State to store payment details for modal
  const [selectedImage, setSelectedImage] = useState(null); // State for selected proof image URL

  // Fetch all payments on component mount
  useEffect(() => {
    const loadAllPayments = async () => {
      try {
        const allPayments = await fetchAllPayments(); // Fetch all payments
        setPayments(allPayments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAllPayments();
  }, []);

  // Handle payment status update
  const handleStatusUpdate = async (paymentId, status) => {
    try {
      const updatedPayment = await updatePaymentStatus(paymentId, status); // Update payment status
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

  // Handle the "View Details" button click to fetch and display all payment details
  const handleViewDetails = async (paymentId) => {
    try {
      const details = await getPaymentWithDetails(paymentId); // Fetch payment details with related data (Booking, Customer, Package)
      setPaymentDetails(details); // Set the details in state
      setShowModal(true); // Show the modal
    } catch (err) {
      console.error("Error fetching payment details:", err.message);
    }
  };

  // Handle the modal close
  const closeModal = () => {
    setShowModal(false);
    setPaymentDetails(null); // Clear payment details when closing modal
  };

  // Handle the image modal close
  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null); // Reset selected image when closing modal
  };

  // Loading or error states
  if (loading) return <div className="text-center text-lg">Loading payment details...</div>;
  if (error) return <div className="text-center text-lg text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Payment Details</h2>

      {/* Table to display all payments */}
      <table className="min-w-full table-auto border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border-b px-4 py-2 text-left">Payment ID</th>
            <th className="border-b px-4 py-2 text-left">Amount Paid</th>
            <th className="border-b px-4 py-2 text-left">Remaining Balance</th>
            <th className="border-b px-4 py-2 text-left">Payment Type</th>
            <th className="border-b px-4 py-2 text-left">Status</th>
            <th className="border-b px-4 py-2 text-left">Payment Method</th>
            <th className="border-b px-4 py-2 text-left">Transaction ID</th>
            <th className="border-b px-4 py-2 text-left">Proof Image</th>
            <th className="border-b px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            // Calculate remaining balance for half payments
            const remainingBalance =
              payment.paymentType === "half"
                ? payment.toPayAmount - payment.halfPaymentAmount
                : 0;

            return (
              <tr key={payment._id} className="bg-white hover:bg-gray-50">
                <td className="border-b px-4 py-2">{payment._id}</td>

                {/* Display the correct amount paid */}
                <td className="border-b px-4 py-2">
                  ${payment.paymentType === "half"
                    ? payment.halfPaymentAmount
                    : payment.amount}
                </td>

                {/* Display remaining balance for half payments */}
                <td className="border-b px-4 py-2">
                  {payment.paymentType === "half" ? `$${remainingBalance}` : "N/A"}
                </td>

                <td className="border-b px-4 py-2">{payment.paymentType}</td>
                <td className="border-b px-4 py-2 text-center">{payment.paymentStatus}</td>
                <td className="border-b px-4 py-2">{payment.paymentMethod}</td>
                <td className="border-b px-4 py-2">{payment.transactionId}</td>

                <td className="border-b px-4 py-2">
                  {/* Display a photo icon instead of the full image */}
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setSelectedImage(payment.proofImageUrl); // Set the selected image URL
                      setShowImageModal(true); // Open the image modal
                    }}
                  >
                    View Proof
                  </button>
                </td>
                <td className="border-b px-4 py-2 flex justify-start gap-2">
                  <button
                    onClick={() => handleStatusUpdate(payment._id, "Completed")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    disabled={payment.paymentStatus === "Completed"}
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(payment._id, "Failed")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    disabled={payment.paymentStatus === "Failed"}
                  >
                    Mark as Failed
                  </button>

                  {/* View Details Button */}
                  <button
                    onClick={() => handleViewDetails(payment._id)} // Fetch and view all details in the modal
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal to display payment details */}
      {showModal && paymentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-xl overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Payment Details</h3>
              <button onClick={closeModal} className="text-red-500 font-bold">X</button>
            </div>

            {/* Display payment details */}
            <p><strong>Payment ID:</strong> {paymentDetails.payment._id}</p>
            <p><strong>Amount Paid:</strong> ${paymentDetails.payment.amount}</p>
            <p><strong>Remaining Balance:</strong> ${paymentDetails.payment.paymentType === "half" ? paymentDetails.payment.toPayAmount - paymentDetails.payment.halfPaymentAmount : 0}</p>
            <p><strong>Booking ID:</strong> {paymentDetails.bookingDetails._id}</p>
            <p><strong>Customer Name:</strong> {paymentDetails.customerDetails.name}</p>
            <p><strong>Phone:</strong> {paymentDetails.customerDetails.phone}</p>
            <p><strong>NIC:</strong> {paymentDetails.customerDetails.nic}</p>
            <p><strong>Package:</strong> {paymentDetails.packageDetails.packageName}</p>
            <p><strong>Booking Date:</strong> {paymentDetails.bookingDetails.bookingDate}</p>
            <p><strong>Payment Method:</strong> {paymentDetails.payment.paymentMethod}</p>

            <button className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Modal for displaying the proof image */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Payment Proof Image</h3>
              <button onClick={closeImageModal} className="text-red-500 font-bold">X</button>
            </div>
            <img
              src={selectedImage}
              alt="Payment Proof"
              className="max-w-full max-h-96 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
