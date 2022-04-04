import express from "express";
import { searchSub } from "../controler/searchControler";

const router = express.Router();

router.route("/sub/:name").get(searchSub);

export default router;
