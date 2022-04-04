import { NextFunction, Request, Response } from "express";

export const checkValidate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.body);

  const password = ["password"];
  Object.keys(req.body).forEach(function (key) {
    if (!password.includes(key) && typeof req.body[key] === "string") {
      // console.log(req.body[key]);

      req.body[key] = req.body[key].trim();
    }
  });
  next();
};
