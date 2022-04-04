import { Request, Response } from "express";
import { RequestCustome } from "../middleware/auth";
import { Post } from "../entity/Post";
import { Sub } from "../entity/Sub";
import { Comment } from "../entity/Comment";

export const createPost = async (req: RequestCustome, res: Response) => {
  const user: any = req.user;
  const { title, body, subname } = req.body;
  if (title.trim() === "") {
    return res.status(500).json({ msg: "title must not be empty" });
  }
  try {
    const post = new Post({
      title,
      body,
      subname,
      user,
      userid: user.id,
    });
    await post.save();
    return res.status(200).json({ msg: "create post", post });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getPosts = async (req: RequestCustome, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 8) as number;
  try {
    const posts = await Post.find({
      order: { created_at: "DESC" },
      relations: ["user", "sub", "comments", "votes"],
      skip: currentPage * perPage,
      take: perPage,
    });

    if (req.user) {
      posts.forEach((p) => {
        p.setUserVote(req.user as any);
      });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getPost = async (req: RequestCustome, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Post.findOneOrFail(id, {
      relations: ["votes"],
    });
    console.log(req.user);

    if (req.user) {
      post.setUserVote(req.user as any);
    }

    res.status(200).json({ msg: "get one post", post });
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

export const createComment = async (req: RequestCustome, res: Response) => {
  const { postId } = req.params;
  const user: any = req.user;
  const { body } = req.body;

  if (body.trim() === "") {
    return res.status(500).json({ msg: "comment must not be empty" });
  }

  console.log(postId, user, body);

  try {
    const post = await Post.findOneOrFail({ id: Number(postId) });
    console.log(post);

    const comment = new Comment({
      body,
      user,
      post,
    });
    await comment.save();
    res.status(200).json({ msg: "create comment", comment });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getComments = async (req: RequestCustome, res: Response) => {
  try {
    const user: any = req.user;
    const id = Number(req.params.postId);
    const post = await Post.findOneOrFail(id);
    const comments = await Comment.find({
      where: { postname: post.title },
      relations: ["votes"],
    });
    if (user) {
      comments.forEach((comment) => {
        comment.setUserVote(user);
      });
    }
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
