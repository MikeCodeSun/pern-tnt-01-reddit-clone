import { Response } from "express";
import jwt from "jsonwebtoken";
import { RequestCustome } from "./auth";

export const user = async (req: RequestCustome, res: Response, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.user = null;
    next();
  } else {
    try {
      const decode = jwt.verify(token, "secret");
      req.user = decode;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ mgs: "not good" });
    }
  }
};
