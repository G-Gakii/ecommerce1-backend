import { Request } from "express";

export interface AuthorizedRequest extends Request {
  user?: {
    id: string;
    [key: string]: any; // You can add more properties based on your user model
  };
  payload?: any; // Add the payload if it's needed
}
