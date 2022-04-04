import express from "express";
import {
  createSub,
  getAllSubs,
  getSub,
  getSubPosts,
  getTopsubs,
  upload,
  uploadSubImg,
} from "../controler/subControler";
import { auth } from "../middleware/auth";
import { user } from "../middleware/user";

const router = express.Router();

router.route("/").post(auth, createSub);
router.route("/").get(getAllSubs);
router.route("/topsub").get(getTopsubs);
router.route("/:subname").get(user, getSubPosts);
router
  .route("/:subname/img")
  .post(auth, getSub, upload.single("img"), uploadSubImg);

export default router;
