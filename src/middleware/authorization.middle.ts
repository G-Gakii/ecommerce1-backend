import { NextFunction, Response } from "express";
import { AuthorizedRequest } from "../interface/auth.interface";

const authorizedRole = (role: string[]) => {
  return (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    if (!role.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden " });
      return;
    }
    next();
  };
};

export default authorizedRole;
