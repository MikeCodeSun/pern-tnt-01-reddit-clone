import { create } from "domain";
import { Response } from "express";
import { Comment } from "../entity/Comment";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { RequestCustome } from "../middleware/auth";

export const getUserPost = async (req: RequestCustome, res: Response) => {
  const username = req.params.username;
  console.log(username);

  try {
    const user = await User.findOneOrFail({
      where: { name: username },
      // select: ["username", "create_at"],
    });
    const posts = await Post.find({
      where: { username },
      relations: ["sub", "comments", "votes"],
    });
    const comments = await Comment.find({
      where: { username },
      relations: ["post"],
    });
    let subMission = [];
    posts.forEach((post) => {
      subMission.push({ type: "post", ...post.toJSON() });
    });

    comments.forEach((comment) => {
      subMission.push({ type: "comment", ...comment });
    });

    subMission.sort((a, b) => {
      if (a.created_at < b.created_at) return 1;
      if (a.created_at > b.created_at) return -1;
      return 0;
    });

    res.status(200).json({ subMission, user });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
