import React, { useState, useEffect } from 'react';
import { fetchAllBookings, updateBookingStatus } from '../API/UserAPI/BookingAPI.js'; 

function DisplayBooking() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const bookingsData = await fetchAllBookings();
        setBookings(bookingsData);
      } catch (err) {
        setError(err.message);
      }
    };

    getBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const updatedBooking = await updateBookingStatus(bookingId, newStatus);

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: updatedBooking.status } : booking
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (bookings.length === 0) {
    return <div>No bookings available.</div>;
  }

  return (
    <div>
      <h2>All Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer Name</th>
            <th>Customer Email</th>
            <th>Package Name</th>
            <th>Package Price</th>
            <th>Booking Date</th>
            <th>Status</th>
            <th>Total Price</th>
            <th>Additional Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking._id}</td>
              <td>{booking.customerId ? booking.customerId.name : 'N/A'}</td>
              <td>{booking.customerId ? booking.customerId.email : 'N/A'}</td>
              <td>{booking.packageId ? booking.packageId.packageName : 'N/A'}</td>
              <td>{booking.packageId ? `$${booking.packageId.price}` : 'N/A'}</td>
              <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
              <td>{booking.status}</td>
              <td>${booking.totalPrice}</td>
              <td>{booking.additionalNotes || 'N/A'}</td>
              <td>
                {booking.status !== 'Confirmed' && (
                  <button onClick={() => handleUpdateStatus(booking._id, 'Confirmed')}>
                    Confirm
                  </button>
                )}
                {booking.status !== 'Cancelled' && (
                  <button onClick={() => handleUpdateStatus(booking._id, 'Cancelled')}>
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DisplayBooking;
