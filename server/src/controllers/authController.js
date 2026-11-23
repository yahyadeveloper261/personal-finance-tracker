import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import { generateUserToken } from "../utils/generateToken.js";

// ================= HASH REFRESH TOKEN =================

const hashRefreshToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// ================= COOKIE OPTIONS =================

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

// ================= REGISTER =================

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check Existing User
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered. Please login.",
      });
    }

    // Hash Password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      image: "",
    });

    // Generate Tokens
    const { accessToken, refreshToken } = generateUserToken(user);

    // Save Refresh Token Hash
    user.refreshTokenHash = hashRefreshToken(refreshToken);

    await user.save();

    // Set Refresh Token Cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "Your account has been created successfully!",
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// ================= LOGIN =================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ email }).select(
      "+password +refreshTokenHash",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate Tokens
    const { accessToken, refreshToken } = generateUserToken(user);

    // Save Refresh Token Hash
    user.refreshTokenHash = hashRefreshToken(refreshToken);

    await user.save();

    // Set Refresh Token Cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Welcome back! You have logged in successfully.",
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// ================= REFRESH ACCESS TOKEN =================

export const refreshUserAccessToken = async (req, res) => {
  try {
    // 1. Get Refresh Token From Cookie
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token missing. Please login again.",
      });
    }

    // 2. Verify Refresh Token
    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH);

    // 3. Find User And Refresh Token Hash
    const user = await User.findById(decoded.userId).select(
      "+refreshTokenHash",
    );

    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh session. Please login again.",
      });
    }

    // 4. Hash Old Refresh Token
    const oldHash = hashRefreshToken(oldRefreshToken);

    // 5. Compare Hash
    if (oldHash !== user.refreshTokenHash) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token invalid. Please login again.",
      });
    }

    // 6. Generate New Tokens
    const { accessToken, refreshToken: newRefreshToken } =
      generateUserToken(user);

    // 7. Save New Refresh Token Hash
    user.refreshTokenHash = hashRefreshToken(newRefreshToken);

    await user.save();

    // 8. Set New Refresh Token Cookie
    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    // 9. Send New Access Token
    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.error("Refresh User Token Error:", error);

    return res.status(401).json({
      success: false,
      message: "Session expired. Please login again.",
    });
  }
};
