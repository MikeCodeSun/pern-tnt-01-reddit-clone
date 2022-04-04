import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface RequestCustome extends Request {
  user: JwtPayload | string;
  file: any;
  sub: any;
}

export const auth = (
  req: RequestCustome,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.cookies.token);
  const token = req.cookies.token;
  if (!token) {
    return res.status(404).json({ msg: "coookie not exits" });
  }
  try {
    const decode = jwt.verify(token, "secret");
    // console.log(decode);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
