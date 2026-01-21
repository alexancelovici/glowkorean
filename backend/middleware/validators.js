/**
 * Input Validation Middlewares
 * 
 * Uses express-validator to validate request data.
 * All validation errors are caught and thrown as AppError.
 * 
 * Usage in routes:
 * router.post('/register', validateRegister, controller);
 */

const { body, validationResult } = require("express-validator");
const { AppError } = require("./errorHandler");

/**
 * Handle validation errors from express-validator
 * Call this in route handlers after validators run
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Collect all error messages
    const messages = errors.array().map(err => err.msg);
    const errorMessage = messages.join(", ");
    
    throw new AppError(errorMessage, 400);
  }
  
  next();
};

/**
 * Validation for user registration
 * POST /api/users/register
 */
const validateRegister = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
];

/**
 * Validation for user login
 * POST /api/users/login
 */
const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

/**
 * Validation for product creation
 * POST /api/products
 */
const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters"),
  
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10 })
    .withMessage("Product description must be at least 10 characters"),
  
  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isInt({ min: 1 })
    .withMessage("Product price must be a positive number"),
  
  body("img")
    .trim()
    .notEmpty()
    .withMessage("Product image URL is required")
    .isURL()
    .withMessage("Product image must be a valid URL"),
  
  body("currency")
    .trim()
    .notEmpty()
    .withMessage("Currency is required")
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be a 3-letter code (e.g., USD, CLP)"),
  
  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Product slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Slug must be lowercase with hyphens (e.g., my-product)"),
];

/**
 * Validation for product update
 * PUT /api/products/:id
 */
const validateProductUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters"),
  
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Product description must be at least 10 characters"),
  
  body("price")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Product price must be a positive number"),
  
  body("img")
    .optional()
    .trim()
    .isURL()
    .withMessage("Product image must be a valid URL"),
];

/**
 * Validation for user update
 * PUT /api/users/update
 */
const validateUserUpdate = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  
  body("country")
    .optional()
    .trim(),
  
  body("address")
    .optional()
    .trim(),
  
  body("zipcode")
    .optional()
    .isNumeric()
    .withMessage("Zipcode must be a number"),
];

module.exports = {
  handleValidation,
  validateRegister,
  validateLogin,
  validateProduct,
  validateProductUpdate,
  validateUserUpdate,
};
