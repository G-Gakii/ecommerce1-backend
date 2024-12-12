import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN as string, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

export const refreshTokenfn = (id: number) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN as string, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
