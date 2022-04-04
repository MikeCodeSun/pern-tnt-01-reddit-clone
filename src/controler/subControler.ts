import { NextFunction, Request, Response } from "express";
import { RequestCustome } from "../middleware/auth";
import { Sub } from "../entity/Sub";
import { getConnection, getRepository } from "typeorm";
import { Post } from "../entity/Post";
import multer from "multer";
import path from "path";
import fs from "fs";

export const createSub = async (req: RequestCustome, res: Response) => {
  const user: any = req.user;
  const { name } = req.body;
  if (name.trim() === "") {
    return res.status(404).json({ msg: "sub name must not be null" });
  }

  // console.log(user);

  try {
    const result = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("sub.name=:name", { name: name })
      .getOne();
    // console.log(result);
    if (result) {
      return res.status(500).json({ msg: "sub already exist!" });
    }

    const sub = new Sub({ name, username: user.name, userid: user.id });
    await sub.save();
    res.status(200).json({ msg: "create sub", result });
  } catch (error) {
    res.status(404).json(error);
  }
};

export const getSubPosts = async (req: RequestCustome, res: Response) => {
  const { subname } = req.params;
  const { user } = req;
  // console.log(subname);
  try {
    const sub = await Sub.findOneOrFail({ name: subname });
    const posts = await Post.find({
      where: { sub },
      relations: ["user", "votes", "sub", "comments"],
      order: { created_at: "DESC" },
    });

    if (user) {
      posts.forEach((post) => {
        post.setUserVote(user as any);
      });
    }

    res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ msg: "someting went wrong", error });
  }
};

// sub update img

// 1 set storage - storage folder,& file name
const storage = multer.diskStorage({
  destination: "public/img",
  filename: (req, file, cb) => {
    const uniName = Date.now();
    cb(null, uniName + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("only allow png or jpeg image"));
    }
  },
});

export const getSub = async (
  req: RequestCustome,
  res: Response,
  next: NextFunction
) => {
  const { subname } = req.params;
  const user: any = req.user;
  try {
    const sub = await Sub.findOneOrFail({ name: subname });
    req.sub = sub;
    if (user.name !== sub.username) {
      return res.status(500).json({ msg: "not the sub owner" });
    }
    // res.json(sub);
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const uploadSubImg = async (req: RequestCustome, res: Response) => {
  try {
    const { file } = req;
    const sub: Sub = req.sub;
    // console.log(req.file);
    // console.log(req.body.type);

    if (req.body.type !== "image") {
      fs.unlinkSync(req.file.path);
      res.status(500).json({ msg: "not good type" });
    }

    let oldImg = sub.image || "";

    sub.image = file.filename;
    await sub.save();
    // const newSub = await Sub.findOneOrFail({ name: sub.name });
    if (oldImg !== "") {
      fs.unlinkSync(`public/img/${oldImg}`);
    }

    res.status(200).json({ msg: "upload img", file, sub });
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
};

// get all subs

export const getAllSubs = async (req: Request, res: Response) => {
  try {
    const subs = await Sub.find();
    res.status(200).json(subs);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// get top 5 sub

export const getTopsubs = async (req: Request, res: Response) => {
  try {
    // const imgUrl = 'COALESCE (s.image, default.jpeg)'
    const subs = await getConnection()
      .createQueryBuilder()
      .select(
        "s.name, COALESCE(s.image, 'default.jpeg'),  count(p.id) as postCount"
      )
      .from(Sub, "s")
      .leftJoin(Post, "p", "s.name = p.subname")
      .groupBy("s.name, s.image")
      .orderBy("postCount", "DESC")
      .limit(5)
      .execute();
    res.status(200).json({ msg: "top 5 subs", subs });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
