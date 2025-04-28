import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchAllPayments, updatePaymentStatus } from "../../API/PaymentAPI";

function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const loadAllPayments = async () => {
      try {
        const allPayments = await fetchAllPayments();
        setPayments(allPayments.filter((p) => p.bookingId));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAllPayments();
  }, []);

  const handleStatusUpdate = async (paymentId, status) => {
    try {
      const updated = await updatePaymentStatus(paymentId, status);
      setPayments((prev) =>
        prev.map((p) => (p._id === paymentId ? updated : p))
      );
      Swal.fire({
        title: "Status Updated",
        text: `Payment status updated to ${status}`,
        icon: status === "Completed" ? "success" : "error",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      });
      setError(err.message);
    }
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="text-center text-lg text-slate-600">
        Loading payment details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-lg text-red-600">Error: {error}</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
        Payment Overview
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-sm border border-slate-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              {[
                "Payment ID",
                "Amount",
                "Amount Paid",
                "Remaining Balance",
                "Payment Type",
                "Status",
                "Method",
                "Transaction ID",
                "Proof",
                "Actions",
              ].map((h) => (
                <th key={h} className="px-4 py-3 border-b text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => {
                const originalAmount = payment.amount;
                const paid =
                  payment.paymentType === "half"
                    ? payment.halfPaymentAmount
                    : payment.amount;
                const remaining =
                  payment.paymentType === "half" ? payment.toPayAmount : 0;
                return (
                  <tr
                    key={payment._id}
                    className="hover:bg-slate-50 border-b transition"
                  >
                    <td className="px-4 py-2">{payment._id}</td>
                    <td className="px-4 py-2">${originalAmount}</td>
                    <td className="px-4 py-2">${paid}</td>
                    <td className="px-4 py-2">${remaining}</td>
                    <td className="px-4 py-2 capitalize">
                      {payment.paymentType}
                    </td>
                    <td className="px-4 py-2 text-center font-medium">
                      {payment.paymentStatus}
                    </td>
                    <td className="px-4 py-2">{payment.paymentMethod}</td>
                    <td className="px-4 py-2">{payment.transactionId}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-sky-500 hover:text-sky-700 underline underline-offset-2"
                        onClick={() => {
                          setSelectedImage(payment.proofImageUrl);
                          setShowImageModal(true);
                        }}
                      >
                        View Proof
                      </button>
                    </td>
                    <td className="px-4 py-2 flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(payment._id, "Completed")
                        }
                        disabled={payment.paymentStatus === "Completed"}
                        className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs rounded-md border border-emerald-300 hover:bg-emerald-200 disabled:opacity-40"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(payment._id, "Failed")
                        }
                        disabled={payment.paymentStatus === "Failed"}
                        className="px-3 py-1.5 bg-rose-100 text-rose-700 text-xs rounded-md border border-rose-300 hover:bg-rose-200 disabled:opacity-40"
                      >
                        Fail
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No payments found for any booking.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* IMAGE MODAL */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-md max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-700">
                Proof Image
              </h3>
              <button
                onClick={closeImageModal}
                className="text-rose-500 hover:text-rose-700 font-bold text-lg"
              >
                ×
              </button>
            </div>
            <img
              src={selectedImage}
              alt="Proof"
              className="max-w-full max-h-[500px] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
