import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Displayrental = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  // New customer fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    axios.get('http://Localhost:5000/rental')
      .then(res => setItems(res.data))
      .catch(err => console.error('Error loading rental items:', err));
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setTotalPrice(quantity * selectedItem.price);
    }
  }, [quantity, selectedItem]);

  const openForm = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setStartDate('');
    setEndDate('');
    setCustomerName('');
    setPhone('');
    setAddress('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleAddToCart = () => {
    if (!startDate || !endDate) {
      Swal.fire('Please select rental dates.');
      return;
    }

    const rentalDetails = {
      itemId: selectedItem._id,
      productName: selectedItem.productName,
      price: selectedItem.price,
      quantity,
      startDate,
      endDate,
      customerName,
      phone,
      address
    };

    console.log('Added to cart:', rentalDetails);
    Swal.fire('Added to cart successfully!', '', 'success');
    closeForm();
  };

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map(item => (
        <div key={item._id} className="border rounded-2xl p-4 shadow-md">
          <img src={item.images?.[0]} alt={item.productName} className="h-48 w-full object-cover rounded-xl mb-4" />
          <h2 className="text-xl font-semibold">{item.productName}</h2>
          <p className="text-gray-500">{item.category}</p>
          <p className="text-sm mt-2">{item.description}</p>
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

      {/* Rental Form Modal */}
      {showForm && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
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
              <label className="block font-medium">Quantity</label>
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full p-2 border rounded-lg"
              />
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
              <label className="block font-medium">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Total Price */}
            <div className="mb-3">
              <label className="block font-medium">Total Price</label>
              <input
                type="text"
                value={`Rs. ${totalPrice}`}
                readOnly
                className="w-full p-2 border rounded-lg bg-gray-100"
              />
            </div>

            {/* Customer Info */}
            <div className="mb-3">
              <label className="block font-medium">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="mb-3">
              <label className="block font-medium">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="mb-3">
              <label className="block font-medium">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                className="w-full p-2 border rounded-lg"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
