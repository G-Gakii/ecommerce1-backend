import { Router } from "express";
import { getProductsBySeller } from "../controller/seller.controller";
import autheticateUser from "../middleware/autheticate.middleware";

const router = Router();

router.get("/seller", autheticateUser, getProductsBySeller);

export default router;
