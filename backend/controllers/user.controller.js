const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppError } = require("../middleware/errorHandler");

// REGISTRO DE USUARIO, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      throw new AppError("Username, email and password are required", 400);
    }

    // Hashear contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // 1. Crear el usuario primero
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // 2. Crear el carrito con el userId del nuevo usuario
    const newCart = await Cart.create({
      userId: newUser._id,
      products: []
    });

    return res.status(201).json({
      success: true,
      msg: "Usuario y carrito creados correctamente",
      user: newUser,
      cart: newCart
    });
  } catch (error) {
    next(error msg: error.message || "Error creando usuario"
    });
  }
};

// LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      throw new AppError("Username does not exist", 400);
    }

    const passCorrecto = await bcryptjs.compare(password, foundUser.password);
    if (!passCorrecto) {
      throw new AppError("The username or password does not correspond", 400);
    }

    const payload = { user: { id: foundUser.id } };
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
    };

    // Generate access token (short-lived - 1 day)
    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "1d",
    });

    // Generate refresh token (long-lived - 7 days)
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_SECRET || process.env.SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", accessToken, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ success: true, msg: "Login successful" });
  } catch (error) {
    next(error);
  }
};

// VERIFICAR USUARIO AUTENTICADO
exports.verifyUser = async (req, res) => {
  try {
    const usuario = await User.findById(req.user.id).select("-password");
    res.json({ usuario });
  } catch (error) {
    res.status(500).json({
      msg: "Error verificando usuario",
      error: error.message,
    });, next) => {
  try {
    const usuario = await User.findById(req.user.id).select("-password");
    
    if (!usuario) {
      throw new AppError("User not found", 404);
    }

    res.json({ success: true, usuario });
  } catch (error) {
    next(error {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      newDataForOurUser,
      { new: true }, next) => {
  try {
    const newDataForOurUser = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      newDataForOurUser,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      msg: "Usuario actualizado con éxito.",
      data: updatedUser,
    });
  } catch (error) {
    next(errorst cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
  };

  res
    .clearCookie("token", cookieOptions)
    .clearCookie("refreshToken", cookieOptions);

  return res.json({ msg: "Logout successful" });
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ msg: "Refresh token not found" });
  }, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token not found", 401);
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET || process.env.SECRET
    );

    const payload = { user: { id: decoded.user.id } };
    const isProd = process.env.NODE_ENV === "production";

    // Generate new access token
    const newAccessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ success: true, msg: "Token refreshed successfully" });
  } catch (error) {
    next(error