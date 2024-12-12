import { Router } from "express";
import { logIn, logOut, registerUser } from "../controller/user.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", logIn);
router.post("/logout", logOut);

export default router;
