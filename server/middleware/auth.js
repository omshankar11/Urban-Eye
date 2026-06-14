import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes (any logged-in user)
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ success: false, message: "Not authorized. No token." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ success: false, message: "Token invalid or expired." });
  }
};

// Admin only
export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as an Admin." });
  }
};

// Admin OR Officer — both can view & update complaints
export const authorizeStaff = (req, res, next) => {
  if (req.user && (req.user.role === 'Admin' || req.user.role === 'Officer')) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized. Staff access required." });
  }
};