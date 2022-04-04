import { Request, Response } from "express";
import { User } from "../entity/User";
import { validate, isEmpty } from "class-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { RequestCustome } from "../middleware/auth";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const errMsg: any = {};
  // if (isEmpty(name)) {
  //   errMsg.name = "name empty";
  //   return res.status(500).json({ errMsg });
  // }

  try {
    const data = await User.findOne({ email });

    if (data) {
      errMsg.user = "user already exist";
      return res.status(500).json({ errMsg });
    }

    const user = new User({ name, email, password });

    const error = await validate(user);

    error.forEach((err) => {
      errMsg[err.property] = Object.entries(err.constraints)[0][1];
      console.log(errMsg);
    });

    if (error.length > 0) {
      return res.status(500).json({ msg: "error", errMsg });
    }

    await user.save();
    res.status(200).json({ msg: "register", user });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const errMsg: any = {};

  if (isEmpty(email)) {
    errMsg.email = "not good email";
    return res.status(500).json({ errMsg });
  }

  try {
    const data = await User.findOne({ email });
    if (!data) {
      errMsg.email = "user not exist";
      return res.status(500).json({ errMsg });
    }
    const isValid = await bcrypt.compare(password, data.password);
    if (!isValid) {
      errMsg.password = "password not right";
      return res.status(500).json({ errMsg });
    }

    const token = jwt.sign({ id: data.id, name: data.name }, "secret", {
      expiresIn: "1d",
    });

    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        secure: false,
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 3600 * 24,
      })
    );

    res.status(200).json({ msg: "login succerr", user: data });
  } catch (error) {
    console.log(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      secure: false,
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      maxAge: Number(new Date(0)),
    })
  );
  res.status(200).json({ msg: "log out" });
};

export const me = (req: RequestCustome, res: Response) => {
  const user = req.user;
  res.status(200).json({ msg: "me", user });
};
