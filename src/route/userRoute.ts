import express from "express";
import { login, logout, me, register } from "../controler/userContoler";
import { auth } from "../middleware/auth";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(auth, me);

export default router;
