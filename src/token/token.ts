import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN as string, {
    expiresIn: "1h",
  });
};

export const refreshTokenfn = (id: string) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN as string, {
    expiresIn: "1y",
  });
};
