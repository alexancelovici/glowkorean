const Cart = require("../models/cart.model");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const { AppError } = require("../middleware/errorHandler");

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, products: [] });
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

exports.editCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      throw new AppError("Products must be an array", 400);
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { products },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Carrito actualizado correctamente",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      throw new AppError("Carrito vacío", 400);
    }

    const line_items = cart.products.map(item => ({
      price: item.priceID,
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      customer_email: userEmail,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    next(error);
  }
};
