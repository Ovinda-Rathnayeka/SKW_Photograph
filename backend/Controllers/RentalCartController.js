import RentalCart from "../Models/RentalCartModel.js";

const addToRentalCart = async (req, res) => {
  const { rentalId, userId, quantity, price, startDate, rentalDays } = req.body;

  try {
    if (
      !rentalId ||
      !userId ||
      !quantity ||
      !price ||
      !startDate ||
      !rentalDays
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + rentalDays);

    const totalPrice = quantity * price * rentalDays;

    const rentalCartItem = new RentalCart({
      rentalId,
      userId,
      quantity,
      price,
      startDate: start,
      endDate: end,
      rentalDays,
      totalPrice,
    });

    const savedItem = await rentalCartItem.save();
    res.status(201).json({
      message: "Rental item added to cart",
      rentalItem: savedItem,
    });
  } catch (error) {
    console.error("Error adding rental item:", error);
    res.status(500).json({
      message: "Error adding rental item to cart",
      error: error.message,
    });
  }
};

const getRentalCartByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await RentalCart.find({ userId }).populate("rentalId");

    if (!cartItems.length) {
      return res.status(404).json({ message: "No items in rental cart" });
    }

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching rental cart:", error);
    res.status(500).json({
      message: "Error fetching rental cart",
      error: error.message,
    });
  }
};

const updateRentalCartItem = async (req, res) => {
  const { rentalCartItemId, quantity, startDate, rentalDays } = req.body;

  try {
    const item = await RentalCart.findById(rentalCartItemId);

    if (!item) {
      return res.status(404).json({ message: "Rental cart item not found" });
    }

    if (quantity !== undefined) item.quantity = quantity;
    if (startDate) {
      item.startDate = new Date(startDate);
      if (rentalDays) {
        const end = new Date(item.startDate);
        end.setDate(end.getDate() + rentalDays);
        item.endDate = end;
        item.rentalDays = rentalDays;
      }
    }

    item.totalPrice = item.quantity * item.price * item.rentalDays;

    const updatedItem = await item.save();
    res.status(200).json({
      message: "Rental cart item updated",
      rentalItem: updatedItem,
    });
  } catch (error) {
    console.error("Error updating rental item:", error);
    res.status(500).json({
      message: "Error updating rental cart item",
      error: error.message,
    });
  }
};

const removeFromRentalCart = async (req, res) => {
  const { rentalCartItemId } = req.params;

  try {
    const deletedItem = await RentalCart.findByIdAndDelete(rentalCartItemId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Rental item not found" });
    }

    res.status(200).json({
      message: "Rental item removed from cart",
      rentalItem: deletedItem,
    });
  } catch (error) {
    console.error("Error removing rental item:", error);
    res.status(500).json({
      message: "Error removing rental cart item",
      error: error.message,
    });
  }
};

export default {
  addToRentalCart,
  getRentalCartByUserId,
  updateRentalCartItem,
  removeFromRentalCart,
};
