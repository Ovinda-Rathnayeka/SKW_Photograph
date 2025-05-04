import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Displayrental = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [rentalDays, setRentalDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [quantityError, setQuantityError] = useState(false);

  const userId = "6602aa6e77c72d5d9c431234"; 

  useEffect(() => {
    axios.get('http://localhost:5000/rental')
      .then(res => {
        const rawItems = res.data;
        const merged = {};

        rawItems.forEach(item => {
          const key = item.productName;
          if (!merged[key]) {
            merged[key] = { ...item };
          } else {
            merged[key].rentalStock += item.rentalStock;
          }
        });

        setItems(Object.values(merged));
      })
      .catch(err => console.error('Error loading rental items:', err));
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
    setStartDate('');
    setCustomerName('');
    setPhone('');
    setAddress('');
    setQuantityError(false);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleAddToCart = async () => {
    if (!startDate) {
      Swal.fire('Please select a rental start date.');
      return;
    }

    if (quantity > selectedItem.rentalStock) {
      Swal.fire(`Cannot rent more than ${selectedItem.rentalStock} units.`);
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
      await axios.post("http://localhost:5000/rental", rentalDetails);

      Swal.fire('Added to cart successfully!', '', 'success');

      setItems(prevItems =>
        prevItems.map(item =>
          item._id === selectedItem._id
            ? { ...item, rentalStock: item.rentalStock - quantity }
            : item
        )
      );
      closeForm();
    } catch (error) {
      console.error("Error adding to rental cart:", error);
      Swal.fire('Failed to add to cart. Try again.', '', 'error');
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map(item => (
        <div key={item._id || item.productName} className="border rounded-2xl p-4 shadow-md">
          <img src={item.images?.[0]} alt={item.productName} className="h-48 w-full object-cover rounded-xl mb-4" />
          <h2 className="text-xl font-semibold">{item.productName}</h2>
          <p className="text-gray-500">{item.category}</p>
          <p className="text-sm mt-2">{item.description}</p>
          <div className="mt-2 text-sm text-gray-600">
            Available to rent: <strong>{item.rentalStock}</strong>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-blue-600">Rs. {item.price} /day</span>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => openForm(item)}
            >
              Rent Now
            </button>
          </div>
        </div>
      ))}

      {showForm && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 py-10">
          <div className="bg-white p-6 shadow-xl w-[600px] max-h-full overflow-y-auto rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Rent: {selectedItem.productName}</h2>

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
              <label className="block font-medium">Quantity (Max: {selectedItem.rentalStock})</label>
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
  );
};

export default Displayrental;
