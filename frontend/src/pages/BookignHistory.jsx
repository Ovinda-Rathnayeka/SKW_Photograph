
import React, { useState, useEffect, useRef } from "react";
import { fetchUserDetails } from "../Api/AuthAPI.js";
import { fetchAllBookings, deleteBooking } from "../Api/BookingAPI.js";
import { getAllPayments } from "../Api/PaymentAPI.js";
import { fetchPhotoPackageById } from "../Api/PackageAPI.js";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../components/images/logo.png";

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

        const allBookings = await fetchAllBookings();
        const myBookings = allBookings.filter((bk) => {
          if (!bk.customerId) return false;
          const cidVal = bk.customerId._id ?? bk.customerId;
          return cidVal.toString() === u._id.toString();
        });

        const allPayments = await getAllPayments();
        const bookingIds = myBookings.map((bk) => bk._id.toString());
        const myPayments = allPayments.filter((p) => {
          const bidVal = p.bookingId?._id ?? p.bookingId;
          const cidVal2 = p.customerId?._id ?? p.customerId;
          return (
            (bidVal != null && bookingIds.includes(bidVal.toString())) ||
            (cidVal2 != null && cidVal2.toString() === u._id.toString())
          );
        });

        const payMap = {};
        myPayments.forEach((p) => {
          const bid = p.bookingId?._id
            ? p.bookingId._id.toString()
            : p.bookingId.toString();
          payMap[bid] = p;
        });

        const enriched = await Promise.all(
          myBookings.map(async (bk) => {
            const pkgId = bk.packageId?._id ? bk.packageId._id : bk.packageId;
            const pkg = await fetchPhotoPackageById(pkgId);
            const payment = payMap[bk._id.toString()] || {};
            return { booking: bk, package: pkg, payment };
          })
        );

        setRecords(enriched);
      } catch (err) {
        console.error(err);
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
        } catch {
          Swal.fire("Error!", "Could not delete booking.", "error");
        }
      }
    });
  };

  const showHalf = records.some((r) => r.payment.paymentType === "half");

  const filtered = records.filter((r) => {
    const { booking, package: pkg, payment } = r;
    const ds = new Date(booking.bookingDate).toLocaleDateString();
    return (
      ds.includes(search) ||
      booking.status.toLowerCase().includes(search.toLowerCase()) ||
      (payment.paymentStatus || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      pkg?.packageName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, w, h);
    pdf.save("booking_summary.pdf");
  };

  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!user)
    return <div className="text-gray-700 text-center mt-8">Loading…</div>;

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      {/* Header + PDF button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Booking &amp; Payment Details
        </h2>
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download Summary PDF
        </button>
      </div>

      {/* On-screen table (centered) */}
      <div className="w-full bg-white shadow-md rounded-lg">
        <table className="w-full table-auto bg-white text-center align-middle">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 border-b">Package</th>
              <th className="py-3 px-4 border-b">Date</th>
              <th className="py-3 px-4 border-b">Time</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Total</th>
              <th className="py-3 px-4 border-b">Paid</th>
              {showHalf && <th className="py-3 px-4 border-b">Half</th>}
              <th className="py-3 px-4 border-b">Remaining</th>
              <th className="py-3 px-4 border-b">Pay Status</th>
              <th className="py-3 px-4 border-b">Method</th>
              <th className="py-3 px-4 border-b">Txn ID</th>
              <th className="py-3 px-4 border-b">Proof</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.booking._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {r.package?.packageName || "-"}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(r.booking.bookingDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {r.booking.bookingTime || "-"}
                </td>
                <td className="py-2 px-4 border-b">{r.booking.status}</td>
                <td className="py-2 px-4 border-b">₨{r.booking.totalPrice}</td>
                <td className="py-2 px-4 border-b">₨{r.payment.amount || 0}</td>
                {showHalf && (
                  <td className="py-2 px-4 border-b">
                    {r.payment.paymentType === "half"
                      ? `₨${r.payment.halfPaymentAmount}`
                      : "-"}
                  </td>
                )}
                <td className="py-2 px-4 border-b">
                  ₨{r.payment.toPayAmount || 0}
                </td>
                <td className="py-2 px-4 border-b">
                  {r.payment.paymentStatus || "-"}
                </td>
                <td className="py-2 px-4 border-b">
                  {r.payment.paymentMethod || "-"}
                </td>
                <td className="py-2 px-4 border-b">
                  {r.payment.transactionId || "-"}
                </td>
                <td className="py-2 px-4 border-b">
                  {r.payment.proofImageUrl ? (
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
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleDelete(r.booking._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hidden PDF layout: cards with emojis */}
      {/* Hidden PDF layout: clean, professional, modern look */}
      <div
        ref={pdfRef}
        style={{
          position: "absolute",
          top: "-10000px",
          left: "-10000px",
          width: 600,
          padding: 24,
          background: "#ffffff",
          fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
          color: "#333",
          fontSize: "14px",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#1f2937", // dark blue/gray
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
              backgroundColor: "#ffffff",
              padding: "4px",
              borderRadius: "6px",
            }}
          />
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "600" }}>
              Your Company Name
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "12px" }}>
              1234 Main St, City, Country
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "12px" }}>
              Phone: +1 234 567 8900
            </p>
          </div>
        </div>

        {/* Customer Details */}
        <div style={{ padding: "20px 0", borderBottom: "1px solid #e5e7eb" }}>
          <h2
            style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "600" }}
          >
            Customer Details
          </h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone || "—"}
          </p>
        </div>

        {/* Booking Details */}
        {records.map((r, i) => (
          <div
            key={i}
            style={{
              padding: "20px 0",
              borderBottom: "1px solid #e5e7eb",
            }}
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
              <strong>Date:</strong>{" "}
              {new Date(r.booking.bookingDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {r.booking.bookingTime || "—"}
            </p>
            <p>
              <strong>Status:</strong> {r.booking.status}
            </p>
            <p>
              <strong>Total Amount:</strong> ₨{r.booking.totalPrice}
            </p>
            <p>
              <strong>Paid Amount:</strong> ₨{r.payment.amount || 0}
            </p>
            {r.payment.paymentType === "half" && (
              <p>
                <strong>Half Payment:</strong> ₨{r.payment.halfPaymentAmount}
              </p>
            )}
            <p>
              <strong>Remaining Amount:</strong> ₨{r.payment.toPayAmount || 0}
            </p>
            <p>
              <strong>Payment Status:</strong> {r.payment.paymentStatus || "-"}
            </p>
            <p>
              <strong>Payment Method:</strong> {r.payment.paymentMethod || "-"}
            </p>
            <p>
              <strong>Transaction ID:</strong> {r.payment.transactionId || "-"}
            </p>
          </div>
        ))}

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#6b7280",
            paddingTop: "20px",
          }}
        >
          www.yourwebsite.com | © {new Date().getFullYear()} Your Company Name
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;