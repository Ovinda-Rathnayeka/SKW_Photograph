import React, { useEffect, useState } from "react";
import {
  fetchCartItems,
  removeFromCart,
  updateCartItem,
} from "../Api/CartAPI.js";
import { fetchUserDetails } from "../Api/AuthAPI.js";
import { useNavigate } from "react-router-dom";

function CartDisplay() {
  const [cartItems, setCartItems] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const userData = await fetchUserDetails();
        setCustomerId(userData._id);
        console.log("Customer ID:", userData._id);
      } catch (error) {
        setError("Failed to load user details");
        console.error("Error fetching user details:", error);
      }
    };

    loadUserDetails();
  }, []);

  useEffect(() => {
    const loadCartItems = async () => {
      if (customerId) {
        try {
          const items = await fetchCartItems(customerId);
          setCartItems(items);
        } catch (error) {
          setError("Failed to load cart items");
          console.error("Error fetching cart items:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCartItems();
  }, [customerId]);

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      setCartItems(cartItems.filter((item) => item._id !== cartItemId));
      alert("Product removed from cart");
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }
    try {
      await updateCartItem(cartItemId, newQuantity);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
      alert("Quantity updated");
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const displayTotalCartValue = () => {
    const total = calculateTotalPrice();
    return `$${total.toFixed(2)}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-xl text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id} className="border-b border-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <img
                        src={item.productId?.image || "/default-image.jpg"}
                        alt={item.productId?.name || "Product Image"}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <span>{item.productId?.name || "Product Name"}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">${item.price}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(item._id, e.target.value)
                      }
                      min="1"
                      className="w-20 p-2 bg-gray-700 text-white rounded-md"
                    />
                  </td>
                  <td className="py-3 px-4">${item.price * item.quantity}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleRemoveFromCart(item._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {/* Total Cart Value Row */}
              <tr className="bg-gray-900 font-bold">
                <td colSpan="3" className="py-3 px-4 text-right">
                  Total Cart Value:
                </td>
                <td className="py-3 px-4">${calculateTotalPrice().toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/checkout")}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Proceed to Checkout
        </button>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default CartDisplay;