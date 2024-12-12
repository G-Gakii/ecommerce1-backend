import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: any; // Use 'any' if you don't have a User model
    payload?: JwtPayload | string;
  }
}
