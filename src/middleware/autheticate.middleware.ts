import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import pool from "../database/db";
import { userByIdQuery } from "../queries/user.queries";
import { AuthorizedRequest } from "../interface/auth.interface";
import "dotenv/config";

const autheticateUser = async (
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "unathorized" });
      return;
    }
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    try {
      const decode = jwt.verify(token, process.env.SECRET_TOKEN as string);

      if (typeof decode === "object" && decode !== null && "id" in decode) {
        const userId = decode.id;

        const userResult = await pool.query(userByIdQuery, [userId]);
        const user = userResult.rows[0];
        if (!user) {
          res.status(404).json({ message: "user not found" });
        }
        req.user = user;
        req.payload = decode;
        next();
      } else {
        res.status(400).json({ message: "Invalid token payload" });
      }
    } catch (error) {
      const err = error as Error;
      if (err.name === "JsonWebTokenError") {
        res.status(401).json({ message: "Invalid token signature" });
        return;
      }
      res
        .status(500)
        .json({ message: `Token verification error: ${err.message}` });
      return;
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
  }
};

export default autheticateUser;
