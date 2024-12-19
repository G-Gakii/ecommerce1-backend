import { Router } from "express";
import { deleteOrder, getOrderByShop } from "../controller/order.controller";
import autheticateUser from "../middleware/autheticate.middleware";
import authorizedRole from "../middleware/authorization.middle";

const router = Router();

router.get(
  "/orders",
  autheticateUser,
  authorizedRole(["shop"]),
  getOrderByShop
);

router.delete(
  "/orders/:id",
  autheticateUser,
  authorizedRole(["shop"]),
  deleteOrder
);
export default router;
