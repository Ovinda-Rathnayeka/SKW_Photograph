import React, { useState } from "react";
import { createPayment } from "../Api/PaymentAPI.js"; 
import { FaUpload } from "react-icons/fa"; 
import { FaMoneyBillAlt } from "react-icons/fa"; 

function PaymentPage({ bookingId, customerId, packageId, totalPrice, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentType, setPaymentType] = useState("full"); // 'full' or 'half'
  const [halfPaymentAmount, setHalfPaymentAmount] = useState(""); // Store half payment amount
  const [proofImage, setProofImage] = useState(null); // Store proof image
  const [isSubmitting, setIsSubmitting] = useState(false); // To handle form submission

  const handleFileChange = (e) => {
    setProofImage(e.target.files[0]); // Set proof image when file is uploaded
  };

  const handleHalfPaymentChange = (e) => {
    const value = e.target.value;
    // Only allow the half payment amount to be less than or equal to total price
    if (value <= totalPrice) {
      setHalfPaymentAmount(value);
    }
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value); // Switch between full and half payment
    setHalfPaymentAmount(""); // Reset half payment amount when switching to full payment
  };

  const handleClear = () => {
    setHalfPaymentAmount(""); // Clear half payment amount
    setProofImage(null); // Clear proof of payment image
    setPaymentMethod("Bank Transfer"); // Reset payment method
  };

  const handleConfirmPayment = async () => {
    if (!proofImage) {
      alert("Please upload a proof of payment.");
      return;
    }

    // Validate half payment amount is not greater than total price
    if (paymentType === "half" && halfPaymentAmount > totalPrice) {
      alert("Half payment amount cannot be greater than total price.");
      return;
    }

    setIsSubmitting(true);

    
    const paymentData = {
      bookingId,
      customerId,
      packageId,
      amount: totalPrice,
      halfPaymentAmount: paymentType === "half" ? halfPaymentAmount : 0, 
      paymentMethod,
      paymentType, 
      paymentStatus: "Pending", 
    };

    try {
      const result = await createPayment(paymentData, proofImage); 
      alert("Payment Confirmed! Transaction ID: " + result.transactionId);
      onClose(); 
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div className="bg-[#1B242C] p-6 rounded-lg shadow-lg w-[95%] max-w-[900px] text-white">
        {/* Header */}
        <h2 className="text-xl font-bold text-red-500 text-center mb-4">💳 Complete Your Payment</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section */}
          <div className="md:w-1/2 space-y-4">
            {/* Booking Details */}
            <div className="bg-[#2A3A45] p-4 rounded-lg">
              <h3 className="text-md font-semibold text-yellow-400">📦 Booking Details</h3>
              <p className="text-sm text-gray-300"><strong>Booking ID:</strong> {bookingId}</p>
              <p className="text-sm text-gray-300"><strong>Total Price:</strong> ${totalPrice}</p>
            </div>

            {/* Payment Type */}
            <div className="bg-[#2A3A45] p-4 rounded-lg">
              <h3 className="text-md font-semibold text-yellow-400">💳 Select Payment Type</h3>
              <select
                value={paymentType}
                onChange={handlePaymentTypeChange}
                className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
              >
                <option value="full">Full Payment</option>
                <option value="half">Half Payment</option>
              </select>
            </div>

            {/* Half Payment Amount */}
            {paymentType === "half" && (
              <div className="bg-[#2A3A45] p-4 rounded-lg">
                <h3 className="text-md font-semibold text-yellow-400">💸 Half Payment</h3>
                <div className="flex items-center gap-2">
                  <FaMoneyBillAlt className="text-yellow-400" /> {/* Icon for half payment */}
                  <input
                    type="number"
                    value={halfPaymentAmount}
                    onChange={handleHalfPaymentChange}
                    className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
                    placeholder="Enter half payment amount"
                    max={totalPrice}
                  />
                </div>
              </div>
            )}

            {/* Upload Proof of Payment */}
            <div className="bg-[#2A3A45] p-4 rounded-lg">
              <h3 className="text-md font-semibold text-yellow-400">📸 Upload Proof of Payment</h3>
              <div className="flex items-center gap-2">
                <FaUpload className="text-yellow-400" /> {/* Icon for upload */}
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
                />
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-[#2A3A45] p-4 rounded-lg">
              <h3 className="text-md font-semibold text-yellow-400">💰 Total Amount</h3>
              <p className="text-lg text-green-400 font-bold">${totalPrice}</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="md:w-1/2 space-y-4">
            {/* Payment Method */}
            <div className="bg-[#2A3A45] p-4 rounded-lg">
              <h3 className="text-md font-semibold text-yellow-400">💳 Select Payment Method</h3>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
              >
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Bank Details */}
            <div className="bg-[#2A3A45] p-4 rounded-lg">
              <h3 className="text-md font-semibold text-yellow-400">🏦 Bank Details</h3>
              <p className="text-sm text-gray-300"><strong>Bank Name:</strong> Example Bank</p>
              <p className="text-sm text-gray-300"><strong>Branch:</strong> Main Branch</p>
              <p className="text-sm text-gray-300"><strong>Account Number:</strong> 1234567890</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
            onClick={handleConfirmPayment}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
