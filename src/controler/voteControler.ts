import { Response } from "express";
import { Comment } from "../entity/Comment";
import { Post } from "../entity/Post";
import { Vote } from "../entity/Vote";
import { RequestCustome } from "../middleware/auth";

export const vote = async (req: RequestCustome, res: Response) => {
  const user: any = req.user;
  const { postId, commentId, value } = req.body;

  // if (![-1, 0, 1].includes(value)) {
  //   return res.status(500).json({ msg: "opraration failed" });
  // }

  if (![-1, 0, 1].includes(value)) {
    return res.send("invalid value");
  }

  try {
    // const post = await Post.findOneOrFail({ id: postId });
    // let vote: Vote | undefined;
    // let comment: Comment | undefined;

    // if (!commentId) {
    //   vote = await Vote.findOne({ user, post });
    // } else {
    //   comment = await Comment.findOneOrFail({ id: commentId });
    //   vote = await Vote.findOne({ user, comment });
    // }

    // if (!vote && value === 0) {
    //   return res.status(500).json({ msg: "not hvae vote" });
    // } else if (!vote) {
    //   if (comment) {
    //     vote = new Vote({ value, user, comment });
    //   } else {
    //     vote = new Vote({ value, user, post });
    //   }
    //   await vote.save();
    // } else if (value === 0) {
    //   await vote.remove();
    // } else if (vote.value !== value) {
    //   vote.value = value;
    //   await vote.save();
    // }

    // strick 2
    const post = await Post.findOneOrFail({ id: postId });
    let comment: Comment | undefined;
    let vote: Vote | undefined;

    if (commentId) {
      comment = await Comment.findOne({ id: commentId });
      vote = await Vote.findOne({ user, comment });
    } else {
      vote = await Vote.findOne({ post, user });
    }

    if (!vote && value === 0) {
      return res.status(404).json({ msg: "not find vote" });
    } else if (!vote) {
      vote = new Vote({ value, user });
      if (comment) {
        vote.comment = comment;
      } else {
        vote.post = post;
      }
      await vote.save();
    } else if (value === 0) {
      await vote.remove();
    } else if (vote.value !== value) {
      vote.value = value;
      await vote.save();
    }

    res.status(200).json({ msg: "vote", vote });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
};
