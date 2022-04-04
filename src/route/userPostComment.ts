import express from "express";
import { getUserPost } from "../controler/userPostControler";
import { user } from "../middleware/user";

const router = express.Router();

router.route("/:username").get(user, getUserPost);

export default router;
