import { User } from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Admin account is disabled");
  }

  user.lastLoginAt = new Date();
  await user.save();

  res.json({
    success: true,
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const getAdminProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export const createAdmin = asyncHandler(async (req, res) => {
  const existingAdminCount = await User.countDocuments();

  if (existingAdminCount > 0 && req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Admin creation is protected after initial setup");
  }

  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
