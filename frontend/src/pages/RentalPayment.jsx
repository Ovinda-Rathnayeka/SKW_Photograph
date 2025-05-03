import React, { useState } from "react";
import { createRentalPayment } from "../Api/RentalPaymentAPI.js";
import { FaUpload } from "react-icons/fa";
import Swal from "sweetalert2";
import dot from "../components/images/dot.jpg";

function RentalPaymentPage({ customerId, cartItems, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [proofImage, setProofImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleFileChange = (e) => {
    setProofImage(e.target.files[0]);
  };

  const handleConfirmPayment = async () => {
    if (!proofImage) {
      alert("Please upload a proof of payment.");
      return;
    }

    setIsSubmitting(true);

    const paymentData = {
      customerId,
      paymentMethod,
      cartItems: cartItems.map((item) => ({
        rentalId: item.rentalId?._id || item.rentalId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const result = await createRentalPayment(paymentData, proofImage);

      Swal.fire({
        title: "Payment Submitted!",
        text: `Transaction ID: ${result.transactionId}`,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      }).then(() => {
        onClose();
      });
    } catch (error) {
      console.error("Rental payment error:", error);
      alert("Payment failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50"
      style={{
        backgroundImage: `url(${dot})`,
        backgroundRepeat: "repeat",
        backgroundSize: "contain",
      }}
    >
      <div className="bg-[#1B242C] p-6 rounded-lg shadow-lg w-[95%] max-w-[900px] text-white pt-20">
        <h2 className="text-xl font-bold text-red-500 text-center mb-4">
          💳 Complete Rental Payment
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 space-y-4">
            <div className="bg-[#2A3A45] p-4 rounded-lg">
              <h3 className="text-md font-semibold text-yellow-400">
                📦 Rental Items
              </h3>
              <ul className="text-sm text-gray-300 list-disc ml-5">
                {cartItems.map((item) => (
                  <li key={item._id}>
                    {item.rentalId?.name || "Item"} - Rs. {item.totalPrice}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#2A3A45] p-4 rounded-lg">
              <h3 className="text-md font-semibold text-yellow-400">
                💳 Payment Method
              </h3>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
              >
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div className="bg-[#2A3A45] p-4 rounded-lg">
              <h3 className="text-md font-semibold text-yellow-400">
                💰 Total Amount
              </h3>
              <p className="text-lg text-green-400 font-bold">
                Rs. {totalAmount}
              </p>
            </div>
          </div>

          <div className="md:w-1/2 space-y-4">
            <div className="bg-[#2A3A45] p-4 rounded-lg">
              <h3 className="text-md font-semibold text-yellow-400">
                📸 Upload Payment Proof
              </h3>
              <div className="flex items-center gap-2">
                <FaUpload className="text-yellow-400" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
                />
              </div>
            </div>

            <div className="bg-[#2A3A45] p-4 rounded-lg">
              <h3 className="text-md font-semibold text-yellow-400">
                🏦 Bank Info
              </h3>
              <p className="text-sm text-gray-300">
                <strong>Bank:</strong> Example Bank
              </p>
              <p className="text-sm text-gray-300">
                <strong>Branch:</strong> Main Branch
              </p>
              <p className="text-sm text-gray-300">
                <strong>Account #:</strong> 1234567890
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
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

export default RentalPaymentPage;
