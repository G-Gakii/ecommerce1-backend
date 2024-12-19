import { Router } from "express";
import { logIn, logOut, registerUser } from "../controller/user.controller";
import autheticateUser from "../middleware/autheticate.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", logIn);
router.post("/logout", autheticateUser, logOut);

export default router;
