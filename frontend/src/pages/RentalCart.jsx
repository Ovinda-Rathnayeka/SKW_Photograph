import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchUserDetails } from "../Api/AuthAPI.js";
import {
  getRentalCartByUserId,
  removeFromRentalCart,
  updateRentalCartItem,
} from "../Api/RentalCartAPI.js";
import RentalPaymentPage from "./RentalPayment";
import dot from "../components/images/dot.jpg";

const RentalCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const user = await fetchUserDetails();
        setUserId(user._id);
        const items = await getRentalCartByUserId(user._id);
        setCartItems(items);
      } catch (err) {
        console.error("Failed to load rental cart:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const handleQuantityChange = async (id, quantity, stock) => {
    if (quantity < 1 || quantity > stock) {
      Swal.fire(`Quantity must be between 1 and ${stock}.`);
      return;
    }

    const itemToUpdate = cartItems.find((item) => item._id === id);
    try {
      const updated = await updateRentalCartItem({
        rentalCartItemId: id,
        quantity: quantity,
        rentalDays: itemToUpdate.rentalDays,
        startDate: itemToUpdate.startDate,
      });

      setCartItems((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                quantity: updated.rentalItem.quantity,
                totalPrice: updated.rentalItem.totalPrice,
                rentalDays: updated.rentalItem.rentalDays,
                startDate: updated.rentalItem.startDate,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
      Swal.fire("Failed to update quantity", "", "error");
    }
  };

  const handleRemove = async (id) => {
    const confirm = await Swal.fire({
      title: "Remove this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
    });
    if (confirm.isConfirmed) {
      try {
        await removeFromRentalCart(id);
        setCartItems((prev) => prev.filter((item) => item._id !== id));
        Swal.fire("Removed!", "", "success");
      } catch (err) {
        console.error("Error removing item:", err);
        Swal.fire("Error removing item", "", "error");
      }
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url(${dot})`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        padding: "1.5rem",
      }}
    >
      <div className="max-w-6xl mx-auto pt-20">
        <h1 className="text-4xl font-bold text-white mb-8">
          🛒 Your Rental Cart
        </h1>

        {loading ? (
          <p className="text-white">Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-gray-300">Your rental cart is empty.</p>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-6 mt-6">
              {/* LEFT COLUMN: Cart Items */}
              <div className="w-full md:w-2/3 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg p-4 md:items-center justify-between"
                  >
                    <div className="flex items-center gap-4 w-full md:w-2/3">
                      <div>
                        <h2 className="text-lg font-semibold">
                          {item.rentalId?.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {item.rentalId?.category}
                        </p>
                        <p className="text-xs text-gray-600">
                          Start: {new Date(item.startDate).toLocaleDateString()}{" "}
                          | Days: {item.rentalDays}
                        </p>
                        <p className="text-sm mt-1 font-bold text-blue-600">
                          Rs. {item.totalPrice}
                        </p>
                        <p className="text-xs text-yellow-600">
                          Status: {item.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 md:mt-0">
                      {/* Quantity Control */}
                      <div className="flex items-center border rounded-md overflow-hidden shadow-sm">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item._id,
                              item.quantity - 1,
                              item.rentalId?.rentalStock
                            )
                          }
                          className="px-3 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200 font-bold text-lg"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="w-12 text-center font-medium text-gray-800 bg-white border-x border-gray-300 outline-none"
                        />
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item._id,
                              item.quantity + 1,
                              item.rentalId?.rentalStock
                            )
                          }
                          className="px-3 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200 font-bold text-lg"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-150"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT COLUMN: Payment Summary */}
              <div className="w-full md:w-1/3">
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m4 0V9a2 2 0 00-2-2h-2.5a2 2 0 00-1.414.586l-6.172 6.172A2 2 0 005 15.414V17"
                      />
                    </svg>
                    Payment Summary
                  </h2>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-800">
                        Rs. {calculateTotal()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax</span>
                      <span className="text-gray-800">Rs. 0</span>
                    </div>
                    <hr className="my-2 border-dashed" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-blue-600">
                        Rs. {calculateTotal()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl text-md font-medium hover:bg-green-700 transition duration-200"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {showPaymentModal && userId && (
          <RentalPaymentPage
            customerId={userId}
            cartItems={cartItems}
            onClose={() => setShowPaymentModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default RentalCart;
