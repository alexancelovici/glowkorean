const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized access" });
  }

  try {
    // Try to verify the access token
    const openToken = jwt.verify(token, process.env.SECRET);
    req.user = openToken.user;
    next();
  } catch (error) {
    // If access token is expired, try to refresh it using the refresh token
    if (error.name === "TokenExpiredError" && refreshToken) {
      try {
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.REFRESH_SECRET || process.env.SECRET
        );

        // Generate new access token
        const payload = { user: { id: decodedRefresh.user.id } };
        const newAccessToken = jwt.sign(payload, process.env.SECRET, {
          expiresIn: "1d",
        });

        const isProd = process.env.NODE_ENV === "production";
        res.cookie("token", newAccessToken, {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? "None" : "Lax",
          maxAge: 24 * 60 * 60 * 1000,
        });

        req.user = decodedRefresh.user;
        next();
      } catch (refreshError) {
        return res.status(401).json({
          msg: "Invalid or expired token",
          error: refreshError.message,
        });
      }
    } else {
      return res.status(401).json({ msg: "Invalid or expired token", error });
    }
  }
};
