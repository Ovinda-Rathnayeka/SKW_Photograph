import CartPayment from "../Models/CartPaymentModel.js";
import Cart from "../Models/CartModel.js";
import cloudinary from "../Middleware/CloudinaryConfig.js";

const generateTransactionId = () => `TRCART${Math.floor(Math.random() * 1000000)}`;

// Create cart payment
export const createCartPayment = async (req, res) => {
  const { customerId, address, totalAmount, paymentMethod } = req.body;

  try {
    const cartItems = await Cart.find({ customerId });
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "No items found in cart." });
    }

    let proofImageUrl = "";
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "cart-payments",
      });
      proofImageUrl = uploaded.secure_url;
    }

    const cartData = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const newPayment = new CartPayment({
      customerId,
      cartItems: cartData,
      totalAmount,
      address,
      paymentMethod,
      proofImageUrl,
      transactionId: generateTransactionId(),
      paymentStatus: "Pending",
    });

    await newPayment.save();
    await Cart.deleteMany({ customerId });

    res.status(201).json({ message: "Payment successful", newPayment });
  } catch (error) {
    console.error("Error processing cart payment:", error);
    res.status(500).json({ message: "Error processing cart payment", error });
  }
};

// Get all cart payments
export const getAllCartPayments = async (req, res) => {
  try {
    const payments = await CartPayment.find()
      .populate("customerId")
      .populate("cartItems.productId");

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart payments", error });
  }
};

// Update payment status (Accept or Deny)
export const updateCartPaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`Updating order ID: ${id} to status: ${status}`);

  if (!["Accepted", "Denied"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updated = await CartPayment.findByIdAndUpdate(
      id,
      { paymentStatus: status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: `Order ${status.toLowerCase()} successfully.` });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};