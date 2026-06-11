import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { generateTokens } from "../models/authService";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user and ensure they have admin privileges
    const user = await User.findOne({ email });
    if (!user || !["SUPER_ADMIN", "STORE_ADMIN"].includes(user.role)) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token in DB for session persistence
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token in secure cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ accessToken, user: { name: user.name, role: user.role } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};