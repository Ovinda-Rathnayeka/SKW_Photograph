import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { fetchUserDetails } from "../Api/AuthAPI.js";
import dot from "../components/images/dot.jpg";

const Displayrental = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [rentalDays, setRentalDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userId, setUserId] = useState(null);
  const [quantityError, setQuantityError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await fetchUserDetails();
        setUserId(user._id);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/rental")
      .then((res) => {
        const rawItems = Array.isArray(res.data)
          ? res.data
          : res.data.rentals || [];
        setItems(rawItems);
      })
      .catch((err) => console.error("Error loading rental items:", err));
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setTotalPrice(quantity * selectedItem.price * rentalDays);
    }
  }, [quantity, selectedItem, rentalDays]);

  const openForm = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setRentalDays(1);
    setStartDate("");
    setQuantityError(false);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      Swal.fire("User not authenticated", "", "error");
      return;
    }

    if (!startDate) {
      Swal.fire("Please select a rental start date.");
      return;
    }

    if (quantity > selectedItem.rentalStock || quantity < 1) {
      Swal.fire(`Quantity must be between 1 and ${selectedItem.rentalStock}.`);
      return;
    }

    const rentalDetails = {
      rentalId: selectedItem._id,
      userId,
      quantity,
      price: selectedItem.price,
      startDate,
      rentalDays,
      totalPrice: quantity * selectedItem.price * rentalDays,
    };

    try {
      await axios.post("http://localhost:5000/rentalcart", rentalDetails);
      Swal.fire("Added to cart successfully!", "", "success").then(() => {
        navigate("/rental-cart");
      });

      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === selectedItem._id
            ? { ...item, rentalStock: item.rentalStock - quantity }
            : item
        )
      );
      closeForm();
    } catch (error) {
      console.error("Error adding to rental cart:", error);
      Swal.fire("Failed to add to cart. Try again.", "", "error");
    }
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
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-20">
        {items.length === 0 ? (
          <p>No rental items found.</p>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="bg-[#1f2937] border border-white/10 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-transform hover:scale-[1.02] flex flex-col"
            >
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="h-48 w-full object-cover rounded-xl mb-4 border border-white/20"
              />

              <h2 className="text-lg font-semibold text-white">{item.name}</h2>
              <p className="text-sm text-orange-400 mb-1">{item.category}</p>
              <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                {item.description}
              </p>

              <div className="mt-auto flex justify-between items-center text-sm">
                <span className="text-lg font-bold text-orange-500">
                  Rs. {item.price} /day
                </span>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    item.rentalStock > 0
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {item.rentalStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <button
                onClick={() => openForm(item)}
                disabled={item.rentalStock < 1}
                className={`mt-4 py-2 px-4 rounded-xl font-medium transition-all duration-300 ${
                  item.rentalStock < 1
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                Rent Now
              </button>
            </div>
          ))
        )}

        {showForm && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 py-10">
            <div className="bg-white p-6 shadow-xl w-[600px] max-h-full overflow-y-auto rounded-2xl">
              <h2 className="text-xl font-bold mb-4">
                Rent: {selectedItem.name}
              </h2>

              <div className="mb-3">
                <label className="block font-medium">Price (Rs/day)</label>
                <input
                  type="text"
                  value={selectedItem.price}
                  readOnly
                  className="w-full p-2 border rounded-lg bg-gray-100"
                />
              </div>

              <div className="mb-3">
                <label className="block font-medium">
                  Quantity (Max: {selectedItem.rentalStock})
                </label>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  max={selectedItem.rentalStock}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setQuantity(val);
                    setQuantityError(val > selectedItem.rentalStock || val < 1);
                  }}
                  className="w-full p-2 border rounded-lg"
                />
                {quantityError && (
                  <p className="text-sm text-red-600 mt-1">
                    Quantity must be between 1 and {selectedItem.rentalStock}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="block font-medium">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="mb-3">
                <label className="block font-medium">Number of Days</label>
                <input
                  type="number"
                  min={1}
                  value={rentalDays}
                  onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="mb-3">
                <label className="block font-medium">Total Price</label>
                <input
                  type="text"
                  value={`Rs. ${totalPrice}`}
                  readOnly
                  className="w-full p-2 border rounded-lg bg-gray-100"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeForm}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={quantityError || quantity < 1}
                  className={`px-4 py-2 text-white rounded-lg ${
                    quantityError || quantity < 1
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Displayrental;
