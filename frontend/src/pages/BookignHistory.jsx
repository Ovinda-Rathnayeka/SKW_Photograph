import React, { useState, useEffect, useRef } from "react";
import { fetchUserDetails } from "../Api/AuthAPI.js";
import { fetchAllBookings, deleteBooking } from "../Api/BookingAPI.js";
import { getAllPayments } from "../Api/PaymentAPI.js";
import { fetchPhotoPackageById } from "../Api/PackageAPI.js";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../components/images/logo.png";
import dot from "../components/images/dot.jpg";

function BookingHistory() {
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    const loadData = async () => {
      try {
        const u = await fetchUserDetails();
        setUser(u);

        // Check if user data is valid
        if (!u || !u._id) {
          console.error("User data is invalid or missing ID");
          setError("Could not load user data. Please try logging in again.");
          return;
        }

        const allBookings = await fetchAllBookings();
        console.log("All bookings:", allBookings);

        // Filter bookings safely
        const myBookings = allBookings.filter((bk) => {
          // Skip invalid bookings
          if (!bk || !bk.customerId) {
            console.log("Booking with missing customerId:", bk);
            return false;
          }

          // Handle different customerId formats safely
          let customerIdString;
          try {
            // Handle cases where customerId could be an object with _id or just the ID string/object
            if (bk.customerId._id) {
              customerIdString = bk.customerId._id.toString();
            } else {
              customerIdString = bk.customerId.toString();
            }

            return customerIdString === u._id.toString();
          } catch (err) {
            console.error("Error comparing customer IDs:", err, bk);
            return false;
          }
        });

        const allPayments = await getAllPayments();
        const bookingIds = myBookings.map((bk) => bk._id.toString());

        // Filter payments safely
        const myPayments = allPayments.filter((p) => {
          if (!p) return false;

          let bookingIdString = null;
          let customerIdString = null;

          // Safely extract booking ID
          try {
            if (p.bookingId) {
              if (p.bookingId._id) {
                bookingIdString = p.bookingId._id.toString();
              } else {
                bookingIdString = p.bookingId.toString();
              }
            }
          } catch (err) {
            console.error("Error extracting booking ID from payment:", err, p);
          }

          // Safely extract customer ID
          try {
            if (p.customerId) {
              if (p.customerId._id) {
                customerIdString = p.customerId._id.toString();
              } else {
                customerIdString = p.customerId.toString();
              }
            }
          } catch (err) {
            console.error("Error extracting customer ID from payment:", err, p);
          }

          return (
            (bookingIdString && bookingIds.includes(bookingIdString)) ||
            (customerIdString && customerIdString === u._id.toString())
          );
        });

        // Create payment map
        const payMap = {};
        myPayments.forEach((p) => {
          try {
            if (p.bookingId) {
              const bid = p.bookingId._id
                ? p.bookingId._id.toString()
                : p.bookingId.toString();
              payMap[bid] = p;
            }
          } catch (err) {
            console.error("Error mapping payment to booking ID:", err, p);
          }
        });

        // Process bookings and fetch package info
        const enriched = await Promise.all(
          myBookings.map(async (bk) => {
            try {
              // Safely get package ID
              let pkgId = null;
              if (bk.packageId) {
                pkgId = bk.packageId._id ? bk.packageId._id : bk.packageId;
              }

              // Fetch package info if we have a valid ID
              let pkg = null;
              if (pkgId) {
                try {
                  pkg = await fetchPhotoPackageById(pkgId);
                } catch (packageErr) {
                  console.error("Error fetching package:", packageErr);
                }
              }

              // Get associated payment
              const payment = payMap[bk._id.toString()] || {};

              return { booking: bk, package: pkg, payment };
            } catch (err) {
              console.error("Error processing booking:", err, bk);
              return { booking: bk, package: null, payment: {} };
            }
          })
        );

        setRecords(enriched);
      } catch (err) {
        console.error("Error in loadData:", err);
        setError("Error loading booking or payment data");
      }
    };

    loadData();
  }, []);

  const handleDelete = (bookingId) => {
    Swal.fire({
      title: "Delete booking?",
      text: "This will delete the booking and its payment.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deleteBooking(bookingId);
          setRecords((prev) => prev.filter((r) => r.booking._id !== bookingId));
          Swal.fire("Deleted!", "Booking removed.", "success");
        } catch (err) {
          console.error("Error deleting booking:", err);
          Swal.fire("Error!", "Could not delete booking.", "error");
        }
      }
    });
  };

  const showHalf = records.some(
    (r) => r.payment && r.payment.paymentType === "half"
  );

  const filtered = records.filter((r) => {
    try {
      const { booking, package: pkg, payment } = r;

      // Safely format date
      let dateStr = "Unknown date";
      try {
        if (booking.bookingDate) {
          dateStr = new Date(booking.bookingDate).toLocaleDateString();
        }
      } catch (err) {
        console.error("Error formatting date:", err);
      }

      // Safe access to searchable fields
      const status = booking.status || "";
      const paymentStatus =
        payment && payment.paymentStatus ? payment.paymentStatus : "";
      const packageName = pkg && pkg.packageName ? pkg.packageName : "";

      return (
        dateStr.includes(search) ||
        status.toLowerCase().includes(search.toLowerCase()) ||
        paymentStatus.toLowerCase().includes(search.toLowerCase()) ||
        packageName.toLowerCase().includes(search.toLowerCase())
      );
    } catch (err) {
      console.error("Error filtering record:", err, r);
      return false;
    }
  });

  const downloadPDF = async () => {
    try {
      const canvas = await html2canvas(pdfRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, w, h);
      pdf.save("booking_summary.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
      Swal.fire("Error!", "Could not generate PDF.", "error");
    }
  };

  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!user)
    return <div className="text-gray-700 text-center mt-8">Loading…</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center px-4 py-20 pt-28"
      style={{ backgroundImage: `url(${dot})` }}
    >
      <div className="max-w-8xl mx-auto bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-8">
        {/* Header + PDF button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-orange-500 drop-shadow">
            Booking &amp; Payment Details
          </h2>
          <button
            onClick={downloadPDF}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 transition"
          >
            Download Summary PDF
          </button>
        </div>

        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by date, status, or package name..."
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {records.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No bookings found. Book a photo session to see it here.
          </div>
        ) : (
          /* On-screen table */
          <div className="rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-center bg-white/80 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-[#1f2937] text-white uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Package</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Paid</th>
                  {showHalf && <th className="px-6 py-3">Half</th>}
                  <th className="px-6 py-3">Remaining</th>
                  <th className="px-6 py-3">Pay Status</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3">Txn ID</th>
                  <th className="px-6 py-3">Proof</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 font-medium">
                {filtered.map((r) => {
                  // Safely format date
                  let formattedDate = "Unknown date";
                  try {
                    if (r.booking.bookingDate) {
                      formattedDate = new Date(
                        r.booking.bookingDate
                      ).toLocaleDateString();
                    }
                  } catch (err) {
                    console.error("Error formatting date in table:", err);
                  }

                  return (
                    <tr
                      key={r.booking._id}
                      className="border-b hover:bg-orange-50 transition duration-200"
                    >
                      <td className="px-6 py-4">
                        {r.package?.packageName || "-"}
                      </td>
                      <td className="px-6 py-4">{formattedDate}</td>
                      <td className="px-6 py-4">
                        {r.booking.bookingTime || "-"}
                      </td>
                      <td className="px-6 py-4">{r.booking.status || "-"}</td>
                      <td className="px-6 py-4">
                        ₨{r.booking.totalPrice || 0}
                      </td>
                      <td className="px-6 py-4">₨{r.payment?.amount || 0}</td>
                      {showHalf && (
                        <td className="px-6 py-4">
                          {r.payment?.paymentType === "half"
                            ? `₨${r.payment.halfPaymentAmount || 0}`
                            : "-"}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        ₨{r.payment?.toPayAmount || 0}
                      </td>
                      <td className="px-6 py-4">
                        {r.payment?.paymentStatus || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {r.payment?.paymentMethod || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {r.payment?.transactionId || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {r.payment?.proofImageUrl ? (
                          <a
                            href={r.payment.proofImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            View Proof
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(r.booking._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Hidden PDF Reference */}
        <div
          ref={pdfRef}
          style={{
            position: "absolute",
            top: "-10000px",
            left: "-10000px",
            width: "1200px",
            padding: "24px",
            background: "#ffffff",
            fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
            color: "#333",
            fontSize: "14px",
          }}
        >
          <div
            style={{
              backgroundColor: "#1f2937",
              color: "#ffffff",
              padding: "20px",
              borderRadius: "8px 8px 0 0",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                height: "50px",
                padding: "4px",
                borderRadius: "6px",
              }}
            />
            <div>
              <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "600" }}>
                SKW Photography
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "12px" }}>
                1234 Main St, City, Country
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "12px" }}>
                Phone: +1 234 567 8900
              </p>
            </div>
          </div>

          <div style={{ padding: "20px 0", borderBottom: "1px solid #e5e7eb" }}>
            <h2
              style={{
                marginBottom: "8px",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Customer Details
            </h2>
            <p>
              <strong>Name:</strong> {user?.name || "—"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "—"}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phone || "—"}
            </p>
          </div>

          {records.map((r, i) => {
            // Safely format date for PDF
            let pdfFormattedDate = "Unknown date";
            try {
              if (r.booking.bookingDate) {
                pdfFormattedDate = new Date(
                  r.booking.bookingDate
                ).toLocaleDateString();
              }
            } catch (err) {
              console.error("Error formatting date in PDF:", err);
            }

            return (
              <div
                key={i}
                style={{ padding: "20px 0", borderBottom: "1px solid #e5e7eb" }}
              >
                <h3
                  style={{
                    marginBottom: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  Package: {r.package?.packageName || "-"}
                </h3>
                <p>
                  <strong>Date:</strong> {pdfFormattedDate}
                </p>
                <p>
                  <strong>Time:</strong> {r.booking.bookingTime || "—"}
                </p>
                <p>
                  <strong>Status:</strong> {r.booking.status || "—"}
                </p>
                <p>
                  <strong>Total Amount:</strong> ₨{r.booking.totalPrice || 0}
                </p>
                <p>
                  <strong>Paid Amount:</strong> ₨{r.payment?.amount || 0}
                </p>
                {r.payment?.paymentType === "half" && (
                  <p>
                    <strong>Half Payment:</strong> ₨
                    {r.payment.halfPaymentAmount || 0}
                  </p>
                )}
                <p>
                  <strong>Remaining:</strong> ₨{r.payment?.toPayAmount || 0}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {r.payment?.paymentStatus || "-"}
                </p>
                <p>
                  <strong>Method:</strong> {r.payment?.paymentMethod || "-"}
                </p>
                <p>
                  <strong>Txn ID:</strong> {r.payment?.transactionId || "-"}
                </p>
              </div>
            );
          })}

          <div
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#6b7280",
              paddingTop: "20px",
            }}
          >
            www.skwphotography.com | © {new Date().getFullYear()} SKW
            Photography
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;
