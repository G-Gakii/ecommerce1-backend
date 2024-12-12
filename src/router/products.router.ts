import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getOneProduct,
  getProducts,
  UpdateProduct,
} from "../controller/products.controller";
import autheticateUser from "../middleware/autheticate.middleware";
import authorizedRole from "../middleware/authorization.middle";

const router = Router();

router.get("/product", getProducts);
router.get("/product/:id", autheticateUser, getOneProduct);
router.post(
  "/product",
  autheticateUser,
  authorizedRole(["seller"]),
  addProduct
);
router.put(
  "/product/:id",
  autheticateUser,
  authorizedRole(["seller"]),
  UpdateProduct
);
router.delete(
  "/product/:id",
  autheticateUser,
  authorizedRole(["seller"]),
  deleteProduct
);
export default router;
