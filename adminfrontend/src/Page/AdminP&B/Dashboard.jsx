import React, { useEffect, useState } from "react";
import Navbar from "../../components/AdminP&B/Navbar.jsx";
import Sidebar from "../../components/AdminP&B/Sidebar.jsx";
import { fetchAllBookings } from "../../API/UserAPI/BookingAPI.js";
import { fetchAllPayments } from "../../API/PaymentAPI.js";


import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  const [bookingStats, setBookingStats] = useState({ pending: 0, confirmed: 0 });
  const [paymentStats, setPaymentStats] = useState({ pending: 0, completed: 0, failed: 0 });
  const [bookingChartData, setBookingChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const bookings = await fetchAllBookings();

       
        const pending = bookings.filter((b) => b.status === "Pending").length;
        const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
        setBookingStats({ pending, confirmed });

       
        const payments = await fetchAllPayments();
        const paymentCounts = {
          pending: payments.filter((p) => p.paymentStatus === "Pending").length,
          completed: payments.filter((p) => p.paymentStatus === "Completed").length,
          failed: payments.filter((p) => p.paymentStatus === "Failed").length,
        };
        setPaymentStats(paymentCounts);

       
        const dateCounts = {};
        bookings.forEach((b) => {
          const date = new Date(b.bookingDate).toLocaleDateString(); 
          dateCounts[date] = (dateCounts[date] || 0) + 1;
        });

        const labels = Object.keys(dateCounts);
        const counts = Object.values(dateCounts);

        setBookingChartData({
          labels,
          datasets: [
            {
              label: "Bookings",
              data: counts,
              backgroundColor: "#3b82f6", 
              borderRadius: 6,
              barThickness: 24,
            },
          ],
        });
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  
  const bookingPieData = {
    labels: ["Pending", "Confirmed"],
    datasets: [
      {
        data: [bookingStats.pending, bookingStats.confirmed],
        backgroundColor: ["#3b82f6", "#10b981"], 
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-600">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <div className="p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold mb-6">📊 Dashboard Overview</h2>

         
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            <StatCard color="bg-blue-500" label="Pending Bookings" value={bookingStats.pending} />
            <StatCard color="bg-green-500" label="Confirmed Bookings" value={bookingStats.confirmed} />
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            <StatCard color="bg-indigo-500" label="Pending Payments" value={paymentStats.pending} />
            <StatCard color="bg-emerald-500" label="Completed Payments" value={paymentStats.completed} />
            <StatCard color="bg-rose-500" label="Failed Payments" value={paymentStats.failed} />
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-4 rounded-lg shadow-md h-72">
              <h3 className="text-base font-semibold mb-3 text-slate-700">📅 Bookings by Date</h3>
              {bookingChartData.labels.length === 0 ? (
                <p className="text-gray-500 text-sm">No booking data available.</p>
              ) : (
                <Bar
                  data={bookingChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: {
                        ticks: { color: "#6b7280", font: { size: 10 } },
                        title: {
                          display: true,
                          text: "Date",
                          color: "#374151",
                          font: { size: 12, weight: "bold" },
                        },
                      },
                      y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: "#6b7280", font: { size: 10 } },
                        title: {
                          display: true,
                          text: "Bookings",
                          color: "#374151",
                          font: { size: 12, weight: "bold" },
                        },
                      },
                    },
                  }}
                />
              )}
            </div>

           
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center h-72">
              <h3 className="text-base font-semibold mb-3 text-slate-700">📊 Booking Status Ratio</h3>
              <div className="w-40 h-40">
                <Pie
                  data={bookingPieData}
                  options={{
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { boxWidth: 12, font: { size: 12 }, color: "#374151" },
                      },
                    },
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


const StatCard = ({ color, label, value }) => (
  <div className={`${color} text-white p-5 rounded-lg shadow-md`}>
    <h3 className="text-lg font-semibold">{label}</h3>
    <p className="text-3xl mt-2">{value}</p>
  </div>
);

export default Dashboard;
