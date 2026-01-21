const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProductById,
  deleteProductById,
  getProductBySlug
} = require("../controllers/product.controller");
const { validateProduct, validateProductUpdate, handleValidation } = require("../middleware/validators");

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.post("/", validateProduct, handleValidation, createProduct);
productRouter.put("/:id", validateProductUpdate, handleValidation, updateProductById);
productRouter.delete("/:id", deleteProductById);
productRouter.get("/:slug", getProductBySlug);

module.exports = productRouter;

