import React, { useState, useEffect } from "react";
import { fetchUserDetails } from "../Api/AuthAPI.js";
import { fetchAllBookings, deleteBooking } from "../Api/BookingAPI.js";
import Swal from "sweetalert2";

function BookingHistory() {
  const [userDetails, setUserDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDetailsAndBookings = async () => {
      try {
        const user = await fetchUserDetails();
        console.log("Fetched User:", user);
        setUserDetails(user);

        const allBookings = await fetchAllBookings();
        console.log("All Bookings:", allBookings);

        // 🔥 Fix for ObjectId support
        const userBookings = allBookings.filter((booking) => {
          const bookingCustomerId =
            booking.customerId?._id || booking.customerId;
          return bookingCustomerId?.toString() === user._id?.toString();
        });

        console.log("User Bookings After Filter:", userBookings);
        setBookings(userBookings);
      } catch (err) {
        setError("Error fetching user details or bookings");
        console.error(err);
      }
    };

    fetchDetailsAndBookings();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
    return (
      bookingDate.includes(search) ||
      booking.status.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDelete = (bookingId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBooking(bookingId);
          setBookings((prev) =>
            prev.filter((booking) => booking._id !== bookingId)
          );
          Swal.fire("Deleted!", "The booking has been deleted.", "success");
        } catch (err) {
          Swal.fire(
            "Error!",
            "There was an issue deleting the booking.",
            "error"
          );
        }
      }
    });
  };

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!userDetails) {
    return (
      <div className="text-center mt-8 text-gray-700">
        Loading user details...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800">
        Booking History
      </h2>

      {/* ✅ Show User Info */}
      <div className="mb-6">
        <h3 className="text-xl text-gray-600">
          <strong>User:</strong> {userDetails.name}
        </h3>
        <h4 className="text-md text-gray-500">
          <strong>Customer ID:</strong> {userDetails._id}
        </h4>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Booking Date or Status"
          value={search}
          onChange={handleSearch}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {filteredBookings.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-6 text-left border-b">Booking Date</th>
                <th className="py-3 px-6 text-left border-b">Booking Time</th>
                <th className="py-3 px-6 text-left border-b">Status</th>
                <th className="py-3 px-6 text-left border-b">Total Price</th>
                <th className="py-3 px-6 text-left border-b">
                  Additional Notes
                </th>
                <th className="py-3 px-6 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 border-b text-sm">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 border-b text-sm">
                    {booking.bookingTime || "-"}
                  </td>
                  <td className="py-3 px-6 border-b text-sm">
                    {booking.status}
                  </td>
                  <td className="py-3 px-6 border-b text-sm">
                    ₨{booking.totalPrice}
                  </td>
                  <td className="py-3 px-6 border-b text-sm">
                    {booking.additionalNotes || "-"}
                  </td>
                  <td className="py-3 px-6 border-b text-sm">
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 p-6 text-center">No bookings found.</p>
        )}
      </div>
    </div>
  );
}

export default BookingHistory;
