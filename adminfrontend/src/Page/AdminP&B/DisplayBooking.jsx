import React, { useState, useEffect } from 'react';
import { fetchAllBookings, updateBookingStatus } from '../../API/UserAPI/BookingAPI.js';
import { fetchCustomerById } from '../../API/UserAPI/CustomerAPI.js';

function DisplayBooking() {
  const [bookings, setBookings] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const getBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await fetchAllBookings();
      setBookings(bookingsData);

      const customerPromises = bookingsData.map(async (booking) => {
        if (booking.customerId && typeof booking.customerId === 'string') {
          try {
            const customer = await fetchCustomerById(booking.customerId);
            return { id: booking.customerId, customer };
          } catch (err) {
            console.error(`Error fetching customer ${booking.customerId}:`, err);
            return null;
          }
        }
        return null;
      });

      const customerData = await Promise.all(customerPromises);
      const customerMap = {};
      customerData.forEach((data) => {
        if (data) customerMap[data.id] = data.customer;
      });

      setCustomerDetails(customerMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    getBookings();
  }, []);

 
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      await getBookings(); 
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-6 text-slate-600">Loading bookings...</div>;
  if (error) return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  if (bookings.length === 0) return <div className="text-center mt-4 text-slate-600">No bookings available.</div>;

  return (
    <div className="max-w-[95%] mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center text-slate-800 mb-8">All Bookings</h2>

      
      <div className="w-full overflow-auto">
        <table className="w-full text-sm bg-white border border-slate-200 rounded-lg shadow-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              {[
                "Booking ID",
                "Customer ID",
                "Name",
                "Email",
                "Phone",
                "Package",
                "Price",
                "Date",
                "Status",
                "Total",
                "Notes",
                "Actions",
              ].map((head) => (
                <th key={head} className="px-4 py-3 border-b text-left whitespace-nowrap">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const customerId = typeof booking.customerId === "object"
                ? booking.customerId._id
                : booking.customerId;

              const customer = typeof booking.customerId === "object"
                ? booking.customerId
                : customerDetails[booking.customerId];

              return (
                <tr key={booking._id} className="hover:bg-slate-50 border-b transition">
                  <td className="px-4 py-2">{booking._id}</td>
                  <td className="px-4 py-2">{customerId}</td>
                  <td className="px-4 py-2">{customer?.name || "N/A"}</td>
                  <td className="px-4 py-2">{customer?.email || "N/A"}</td>
                  <td className="px-4 py-2">{customer?.phone || "N/A"}</td>
                  <td className="px-4 py-2">{booking.packageId?.packageName || "N/A"}</td>
                  <td className="px-4 py-2">{booking.packageId ? `$${booking.packageId.price}` : "N/A"}</td>
                  <td className="px-4 py-2">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 capitalize">{booking.status}</td>
                  <td className="px-4 py-2">${booking.totalPrice}</td>
                  <td className="px-4 py-2">{booking.additionalNotes || "N/A"}</td>
                  <td className="px-4 py-2 flex flex-wrap gap-2">
                    {booking.status !== 'Confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'Confirmed')}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded border border-emerald-300 hover:bg-emerald-200"
                      >
                        Confirm
                      </button>
                    )}
                    {booking.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'Cancelled')}
                        className="px-3 py-1 bg-rose-100 text-rose-700 text-xs rounded border border-rose-300 hover:bg-rose-200"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DisplayBooking;
