import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

type ExpiryDuration = SignOptions["expiresIn"];

export const generateToken = (payload: { id: string; email: string, role: string }, duration: ExpiryDuration) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: duration });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};