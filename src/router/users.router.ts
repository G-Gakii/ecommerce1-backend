import { Router } from "express";
import { logIn, logOut, registerUser } from "../controller/user.controller";

const router = Router();

router.post("/", registerUser);
router.post("/login", logIn);
router.post("/logout", logOut);

export default router;
