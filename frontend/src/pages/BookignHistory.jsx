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
  if (!user) return <div className="text-white text-center mt-8">Loading…</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center px-6 py-20 pt-28"
      style={{ backgroundImage: `url(${dot})` }}
    >
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-xlmax-w-6xl mx-auto bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-orange-500">
            📅 Booking & Payments
          </h2>
          <button
            onClick={downloadPDF}
            className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-orange-600 transition duration-300"
          >
            Download PDF
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm text-center bg-white/80 shadow-md rounded-lg overflow-hidden">
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
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 font-medium">
              {filtered.map((r) => (
                <tr
                  key={r.booking._id}
                  className="border-b hover:bg-orange-50 transition duration-200"
                >
                  <td className="px-6 py-4">{r.package?.packageName || "-"}</td>
                  <td className="px-6 py-4">
                    {new Date(r.booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{r.booking.bookingTime || "-"}</td>
                  <td className="px-6 py-4">{r.booking.status}</td>
                  <td className="px-6 py-4">₨{r.booking.totalPrice}</td>
                  <td className="px-6 py-4">₨{r.payment.amount || 0}</td>
                  {showHalf && (
                    <td className="px-6 py-4">
                      {r.payment.paymentType === "half"
                        ? `₨${r.payment.halfPaymentAmount}`
                        : "-"}
                    </td>
                  )}
                  <td className="px-6 py-4">₨{r.payment.toPayAmount || 0}</td>
                  <td className="px-6 py-4">
                    {r.payment.paymentStatus || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {r.payment.paymentMethod || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {r.payment.transactionId || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {r.payment.proofImageUrl ? (
                      <a
                        href={r.payment.proofImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-700 underline"
                      >
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(r.booking._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition"
                    >
                      Delete
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

export default BookingHistory;
