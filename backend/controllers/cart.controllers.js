/*
    getCart: 
*/
import { Cart } from "../models/cart.models.js";
import { Product } from "../models/product.models.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [] } });
    }
    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
    add to Cart
*/

export const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    // does the product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "product not found" });
    }

    // find the user's cart
    let cart = await Cart.findOne({ userId });

    // if cart doesnot doesnot exists
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1, price: product.productPrice }],
        totalPrice: product.productPrice,
      });
    } else {
      // find if product is already in the cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );
      if (itemIndex > -1) {
        // if product exists  -> increase quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        // if new product -> push to cart
        cart.items.push({
          productId,
          quantity: 1,
          price: product.productPrice,
        });
      }

      // Recalculate total price
      cart.totalPrice = (cart?.items || []).reduce(
        (acc, item) => acc + (item?.price ?? 0) * (item?.quantity ?? 0),
        0,
      );
    }

    // save updated cart
    await cart.save();

    // populate product details before sending response

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );

    return res.status(200).json({
      success: true,
      message: "product added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
    update quantity
*/

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(400)
        .json({ success: false, message: "cart not found" });
    }

    // check if the item is already in the cart
    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (!item) {
      return res
        .status(400)
        .json({ success: false, message: "item not found" });
    }

    if (type === "increase") item.quantity += 1;
    if (type === "decrease" && item.quantity > 1) item.quantity -= 1;

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );
    return res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
    remove item from cart
*/

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Remove the item
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    // 👉 If no items left, delete the cart
    if (cart.items.length === 0) {
      await cart.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Cart deleted (no items left)",
        cart: null,
      });
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    // Populate and save
    await cart.populate("items.productId");
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
