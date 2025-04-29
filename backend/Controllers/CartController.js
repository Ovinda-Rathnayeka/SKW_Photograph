import Cart from "../Models/CartModel.js";

const addToCart = async (req, res) => {
  const { productId, quantity, price, customerId } = req.body;

  try {
    const existingCartItem = await Cart.findOne({ customerId, productId });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return res.status(200).json({
        message: "Cart updated successfully",
        cartItem: existingCartItem,
      });
    }

    const newCartItem = new Cart({
      productId,
      customerId,
      quantity,
      price,
    });

    const savedCartItem = await newCartItem.save();
    return res
      .status(201)
      .json({ message: "Product added to cart", cartItem: savedCartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
};
const getCartByCustomerId = async (req, res) => {
  const { customerId } = req.params;

  try {
    const cartItems = await Cart.find({ customerId }).populate("productId");

    if (cartItems.length === 0) {
      return res.status(404).json({ message: "No products found in the cart" });
    }

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

const updateCartItem = async (req, res) => {
  const { cartItemId, quantity } = req.body;
  try {
    const updatedCartItem = await Cart.findByIdAndUpdate(
      cartItemId,
      { quantity },
      { new: true }
    );

    if (!updatedCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({
      message: "Cart item updated successfully",
      cartItem: updatedCartItem,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Error updating cart item", error });
  }
};

const removeFromCart = async (req, res) => {
  const { cartItemId } = req.params;
  try {
    const deletedCartItem = await Cart.findByIdAndDelete(cartItemId);

    if (!deletedCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({
      message: "Product removed from cart",
      cartItem: deletedCartItem,
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res
      .status(500)
      .json({ message: "Error removing product from cart", error });
  }
};

export default {
  addToCart,
  getCartByCustomerId,
  updateCartItem,
  removeFromCart,
};
