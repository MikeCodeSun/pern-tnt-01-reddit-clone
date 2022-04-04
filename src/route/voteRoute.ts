import express from "express";
import { vote } from "../controler/voteControler";
import { auth } from "../middleware/auth";

const router = express.Router();

router.route("/").post(auth, vote);

export default router;
