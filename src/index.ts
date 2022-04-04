import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import userRouter from "./route/userRoute";
import postRouter from "./route/postRoute";
import subRouter from "./route/subRoute";
import voteRouter from "./route/voteRoute";
import { checkValidate } from "./middleware/midValidate";
import cookieParser from "cookie-parser";
import cors from "cors";
import userPost from "./route/userPostComment";
import searchRoute from "./route/searchRoute";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.get("/", (_, res) => res.send("Home Page"));

app.use("/api/v1/user", checkValidate, userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/sub", subRouter);
app.use("/api/v1/vote", voteRouter);
app.use("/api/v1/userpost", userPost);
app.use("/api/v1/search", searchRoute);

app.listen(4000, async () => {
  console.log("server is running on port 4000");
  try {
    await createConnection();
  } catch (error) {
    console.log(error);
  }
});
