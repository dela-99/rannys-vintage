import jwt from "jsonwebtoken";

interface TokenUser {
  _id: { toString: () => string };
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "rannys_vintage_secret_key_2026";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "rannys_refresh_secret_2026";

export const generateTokens = (user: TokenUser) => {
  const userId = user._id.toString();
  const accessToken = jwt.sign({ id: userId, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

  const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
