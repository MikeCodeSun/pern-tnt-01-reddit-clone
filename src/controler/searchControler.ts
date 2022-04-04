import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Sub } from "../entity/Sub";

export const searchSub = async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const subs = await getRepository(Sub)
      .createQueryBuilder()
      .where("LOWER(name) like :name", {
        name: `%${name.toLowerCase().trim()}%`,
      })
      .getMany();
    res.status(200).json(subs);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
