import React, { useState, useEffect } from "react";
import { fetchAllBookings } from "../../API/UserAPI/BookingAPI.js"; // API to fetch bookings
import { getEmployees } from "../../API/AdminAPI.js"; // API to fetch employees
import { createAssignTask } from "../../API/AssignTaskAPI.js"; // API to create AssignTask

function AssignTask() {
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState({
    photographers: [],
    videographers: [],
    helpers: [],
  });

  // Fetch confirmed bookings and employees
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const allBookings = await fetchAllBookings();
        const confirmedBookings = allBookings.filter(
          (booking) => booking.status === "Confirmed"
        );
        setBookings(confirmedBookings);
      } catch (error) {
        setError("Failed to fetch bookings.");
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };

    const fetchEmployees = async () => {
      try {
        const employeesData = await getEmployees();
        setEmployees(employeesData);
      } catch (error) {
        setError("Failed to fetch employees.");
        console.error(error);
      }
    };

    fetchBookings();
    fetchEmployees();
  }, []);

  const handleEmployeeSelection = (role, empId, isChecked) => {
    setSelectedEmployees((prevState) => {
      const updatedSelection = { ...prevState };
      if (isChecked) {
        updatedSelection[role] = [...updatedSelection[role], empId];
      } else {
        updatedSelection[role] = updatedSelection[role].filter(
          (id) => id !== empId
        );
      }
      return updatedSelection;
    });
  };

  const handleAssignEmployees = (booking) => {
    const taskData = {
      taskId: `${booking._id}-task`, // Unique task ID, based on the booking ID
      employeeIds: [
        ...selectedEmployees.photographers,
        ...selectedEmployees.videographers,
        ...selectedEmployees.helpers,
      ],
      resourcesId: [], // You can send resource IDs if needed, otherwise leave empty
      dateRange: {
        startDate: booking.bookingDate,
        endDate: booking.bookingDate,
      },
      timeRange: {
        startTime: booking.bookingTime,
        endTime: booking.bookingTime,
      },
    };

    createAssignTask(taskData)
      .then((data) => {
        if (data) {
          alert("Employees assigned successfully.");
          setBookings((prevBookings) => [
            ...prevBookings,
            {
              ...booking,
              taskId: taskData.taskId,
              employeeIds: taskData.employeeIds,
              resourcesId: taskData.resourcesId,
              dateRange: taskData.dateRange,
              timeRange: taskData.timeRange,
            },
          ]);
          setSelectedEmployees({
            photographers: [],
            videographers: [],
            helpers: [],
          });
        } else {
          alert("Error assigning employees: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Error assigning employees.");
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!bookings.length) {
    return <p>No confirmed bookings available.</p>;
  }

  const photographers = employees.filter(
    (emp) => emp.jobRole?.toLowerCase() === "photographers"
  );
  const videographers = employees.filter(
    (emp) => emp.jobRole?.toLowerCase() === "videographers"
  );
  const helpers = employees.filter(
    (emp) => emp.jobRole?.toLowerCase() === "helpers"
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-screen-3xl mx-auto p-8 rounded-lg shadow-xl bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Assign Employees
        </h2>
        <div className="overflow-x-auto">
          {" "}
          {/* Make the table horizontally scrollable if needed */}
          <table className="table-auto w-full border-collapse shadow-md rounded-lg bg-white">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="px-6 py-3 border-b text-left">Booking ID</th>
                <th className="px-6 py-3 border-b text-left">Customer Name</th>
                <th className="px-6 py-3 border-b text-left">Booking Date</th>
                <th className="px-6 py-3 border-b text-left">Booking Time</th>
                <th className="px-6 py-3 border-b text-left">Total Price</th>
                <th className="px-6 py-3 border-b text-left">Photographers</th>
                <th className="px-6 py-3 border-b text-left">Videographers</th>
                <th className="px-6 py-3 border-b text-left">Helpers</th>
                <th className="px-6 py-3 border-b text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="hover:bg-gray-100 hover:text-gray-700 transition-all duration-300"
                >
                  <td className="px-6 py-4 border-b">{booking._id}</td>
                  <td className="px-6 py-4 border-b">
                    {booking.customerId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {booking.bookingTime || "N/A"}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {booking.totalPrice || "N/A"}
                  </td>
                  {/* Photographers column */}
                  <td className="px-6 py-4 border-b">
                    {photographers.map((emp) => (
                      <div key={emp._id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.photographers.includes(
                            emp._id
                          )}
                          onChange={(e) =>
                            handleEmployeeSelection(
                              "photographers",
                              emp._id,
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        {emp.name}
                      </div>
                    ))}
                  </td>
                  {/* Videographers column */}
                  <td className="px-6 py-4 border-b">
                    {videographers.map((emp) => (
                      <div key={emp._id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.videographers.includes(
                            emp._id
                          )}
                          onChange={(e) =>
                            handleEmployeeSelection(
                              "videographers",
                              emp._id,
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        {emp.name}
                      </div>
                    ))}
                  </td>
                  {/* Helpers column */}
                  <td className="px-6 py-4 border-b">
                    {helpers.map((emp) => (
                      <div key={emp._id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.helpers.includes(emp._id)}
                          onChange={(e) =>
                            handleEmployeeSelection(
                              "helpers",
                              emp._id,
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        {emp.name}
                      </div>
                    ))}
                  </td>
                  {/* Action column with "Assign Employees" button */}
                  <td className="px-6 py-4 border-b text-center">
                    <button
                      onClick={() => handleAssignEmployees(booking)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Assign Employees
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AssignTask;
