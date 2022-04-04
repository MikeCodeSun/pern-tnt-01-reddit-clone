import express from "express";
import {
  createComment,
  createPost,
  getComments,
  getPost,
  getPosts,
} from "../controler/postControler";
import { auth } from "../middleware/auth";
import { user } from "../middleware/user";

const router = express.Router();
router.route("/").post(auth, createPost).get(user, getPosts);
router.route("/:id").get(user, getPost);
router
  .route("/:postId/comment")
  .post(auth, createComment)
  .get(user, getComments);

export default router;
