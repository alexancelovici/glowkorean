const Product = require("../models/product.model");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const { AppError } = require("../middleware/errorHandler");

// Obtener todos los productos
exports.getAllProducts = async (req, res, next) => {
  try {
    const productos = await Product.find({});
    res.json({ success: true, productos });
  } catch (error) {
    next(error);
  }
};

// Obtener un producto por slug
exports.getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug });

    if (!product) {
      throw new AppError("Producto no encontrado", 404);
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// Crear producto y sincronizar con Stripe
exports.createProduct = async (req, res) => {
  const { name, price, description, img, currency, slug } = req.body;

  try {, next) => {
  try {
    const { name, price, description, img, currency, slug } = req.body;

    // Validate input
    if (!name || !price || !description || !img || !currency || !slug) {
      throw new AppError("All fields are required", 400);
    }

    const product = await stripe.products.create({
      name,
      description,
      images: [img],
      metadata: { productDescription: description, slug }
    });

    const stripePrice = await stripe.prices.create({
      unit_amount: price,
      currency,
      product: product.id
    });

    const newProduct = await Product.create({
      idProd: product.id,
      priceID: stripePrice.id,
      name,
      price,
      description,
      img,
      slug,
      currency
    });

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    next(error
// Actualizar producto por ID
exports.updateProductById = async (req, res) => {
  const { name, price, description, img } =, next) => {
  try {
    const { name, price, description, img } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, img },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      throw new AppError("Producto no encontrado", 404);
    }

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    next(error
};

// Eliminar producto por ID
exports.deleteProductById = async (req, res) => {
  try {
    const productoBorrado = await Product.findByIdAndDelete(req.params.id);

    if (!productoBorrado) {, next) => {
  try {
    const productoBorrado = await Product.findByIdAndDelete(req.params.id);

    if (!productoBorrado) {
      throw new AppError("Producto no encontrado", 404);
    }

    res.json({ success: true, product: productoBorrado });
  } catch (error) {
    next(error