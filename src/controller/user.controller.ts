import { Request, Response } from "express";
import pool from "../database/db";
import {
  addUserQuery,
  existingUserQuery,
  updateRefreshTokenQuery,
  userByIdQuery,
} from "../queries/user.queries";
import { argon2d } from "argon2";
import * as argon2 from "argon2";
import { generateToken, refreshTokenfn } from "../token/token";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { AuthorizedRequest } from "../interface/auth.interface";

export const registerUser = async (req: Request, res: Response) => {
  try {
    await pool.query("BEGIN");
    const { email, password, role } = req.body;
    if (!email && !password && !role) {
      res.status(400).json({ message: "All fields required" });
      return;
    }
    let existingUser = await pool.query(existingUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      res.status(409).json({ message: "Email already exist" });
      return;
    }
    const hashedPassword = await argon2.hash(password);
    const userId = uuidv4();
    const created_at = new Date();
    const user = await pool.query(addUserQuery, [
      email,
      hashedPassword,
      role,
      userId,
      created_at,
    ]);

    const accessToken = generateToken(userId);
    const refreshToken = refreshTokenfn(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);

    await pool.query(updateRefreshTokenQuery, [hashedRefreshToken, userId]);
    await pool.query("COMMIT");
    res.status(201).json({ accessToken, refreshToken });
    return;
  } catch (error) {
    await pool.query("ROLLBACK");
    const err = error as Error;
    res.status(500).json({ message: `internal server error ${err.message} ` });
  }
};

export const logIn = async (req: Request, res: Response) => {
  try {
    await pool.query("BEGIN");
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email required" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "Password required" });
      return;
    }
    const user = await pool.query(existingUserQuery, [email]);
    if (user.rows.length === 0) {
      res.status(404).json({ message: `${email} not registered` });
      return;
    }
    const appUser = user.rows[0];
    const isPasswordValid = await argon2.verify(appUser.password, password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const userId = appUser.user_id;

    const accessToken = generateToken(userId);
    const refreshToken = refreshTokenfn(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await pool.query(updateRefreshTokenQuery, [hashedRefreshToken, userId]);
    await pool.query("COMMIT");
    res.status(200).json({ accessToken, refreshToken });
    return;
  } catch (error) {
    await pool.query("ROLLBACK");
    const err = error as Error;
    res.status(500).json(`internal server error ${err.message}`);
    return;
  }
};

export const logOut = async (req: AuthorizedRequest, res: Response) => {
  try {
    await pool.query("BEGIN");
    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userId = req.user.user_id;
    await pool.query(updateRefreshTokenQuery, [null, userId]);
    await pool.query("COMMIT");
    res.status(200).json({ message: "logged out successfully" });
    return;
  } catch (error) {
    await pool.query("ROLLBACK");
    const err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
  }
};
