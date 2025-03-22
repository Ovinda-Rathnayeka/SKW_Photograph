import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserDetails } from "../Api/AuthAPI";
import { fetchCartItems } from "../Api/CartAPI";
import { createCartPayment } from "../Api/CartPaymentAPI";
import { FaUpload } from "react-icons/fa";

function CartPaymentPage() {
  const navigate = useNavigate();

  const [customerId, setCustomerId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [address, setAddress] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCustomerAndCart = async () => {
      try {
        const user = await fetchUserDetails();
        setCustomerId(user._id);

        const items = await fetchCartItems(user._id);
        setCartItems(items);

        const total = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        setTotalAmount(total);
      } catch (err) {
        console.error("Error loading cart and user:", err);
      }
    };

    loadCustomerAndCart();
  }, []);

  const handleFileChange = (e) => setProofImage(e.target.files[0]);

  const handleConfirmPayment = async () => {
    if (!address) {
      alert("Please enter your address.");
      return;
    }

    setIsSubmitting(true);

    const paymentData = {
      customerId,
      address,
      totalAmount,
    };

    try {
      const result = await createCartPayment(paymentData, proofImage);
      alert("Payment successful! Transaction ID: " + result.newPayment.transactionId);
      navigate("/cart");
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/cart");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl text-black">
        <h2 className="text-xl font-bold text-center mb-4 text-red-500">💳 Cart Payment</h2>

        {customerId && (
          <div className="mb-3 text-sm text-gray-700">
            <strong>🧑 Customer ID:</strong>{" "}
            <span className="text-blue-600">{customerId}</span>
          </div>
        )}

        <div className="mb-4">
          <label className="font-semibold text-gray-700">🏠 Address:</label>
          <textarea
            className="w-full p-2 border rounded"
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your shipping/billing address"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="font-semibold text-gray-700">
            📸 Upload Payment Slip <span className="text-gray-500">(optional)</span>:
          </label>
          <div className="flex items-center gap-2 mt-2">
            <FaUpload className="text-gray-700" />
            <input type="file" onChange={handleFileChange} />
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">🛒 Cart Summary</h3>
          {cartItems.length === 0 ? (
            <p>No items in your cart.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="text-sm text-gray-700">
                {item.productId.name} × {item.quantity} — ${item.price * item.quantity}
              </div>
            ))
          )}
          <p className="font-bold mt-2 text-green-700 text-lg">
            Total Amount: ${totalAmount.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleCancel}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPayment}
            disabled={isSubmitting}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {isSubmitting ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPaymentPage;