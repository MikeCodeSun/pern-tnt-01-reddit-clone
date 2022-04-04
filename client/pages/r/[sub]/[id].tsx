import React from "react";
import { useRouter } from "next/router";
import { GoComment } from "react-icons/go";
import { FaArrowDown, FaArrowUp, FaRegBookmark, FaShare } from "react-icons/fa";
import Link from "next/link";
import userImg from "../../../pages/asset/user-avatar.png";
import classNames from "classnames";
import useSWR from "swr";
import dayjs from "dayjs";
import Image from "next/image";
import RelativeTime from "dayjs/plugin/relativeTime";
import Axios from "axios";
import Comment from "../../../component/Comment";
import CommentInput from "../../../component/CommentInput";
import { useGlobleContext } from "../../../context/context";

dayjs.extend(RelativeTime);

export default function Id() {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useSWR(`/post/${id}`);
  const { state } = useGlobleContext();
  // console.log(data);
  const handleVote = async (value: number, postId: number) => {
    try {
      await Axios.post("/vote", { value, postId });
    } catch (error) {
      console.log(error);
    }
  };
  if (!data) return <h1 className="mt-5 text-center ">No Posts</h1>;
  const { post } = data;
  return (
    <div className="w-1/2 mx-auto mt-5 ">
      <article
        key={post.id}
        className="flex max-w-xl mb-5 capitalize bg-white border rounded cursor-pointer hover:border-black"
      >
        <div className="flex flex-col items-center w-10 pt-2 mr-1 text-center bg-gray-50">
          <div
            className={classNames("hover:text-blue-600 ", {
              "text-blue-500": post.userVote === 1,
            })}
            onClick={() => handleVote(1, post.id)}
          >
            <FaArrowUp />
          </div>
          <div className="text-sm">{post.voteScore}</div>
          <div
            className={classNames("hover:text-red-600", {
              "text-red-500": post.userVote === -1,
            })}
            onClick={() => handleVote(-1, post.id)}
          >
            <FaArrowDown />
          </div>
        </div>

        <div className="w-full p-1 bg-white">
          <div className="flex items-center mb-2">
            <div className="relative w-5 h-5 mr-1">
              <Image src={userImg} layout="fill" objectFit="cover" />
            </div>
            <Link href={`/r/${post.subname}`}>
              <a>
                <p className="mr-1 font-bold">/{post.subname}</p>
              </a>
            </Link>
            <p className="mr-1 text-xs">post by {post.username}</p>
            <p className="mr-1 text-xs">{dayjs(post.created_at).fromNow()}</p>
          </div>
          <Link href={`/r/${post.subname}/${post.id}`}>
            <div className="mb-2">
              <h5 className="font-bold">{post.title}</h5>
              <p>{post.body}</p>
            </div>
          </Link>

          <div className="flex ">
            <div className="flex items-center p-2 rounded hover:bg-gray-200">
              <GoComment />
              <span className="ml-1">{post.commentCount} Comments</span>
            </div>
            <div className="flex items-center p-2 rounded hover:bg-gray-200">
              <FaShare />
              <span className="ml-1">share</span>
            </div>
            <div className="flex items-center p-2 rounded hover:bg-gray-200">
              <FaRegBookmark />
              <span className="ml-1">save</span>
            </div>
          </div>
        </div>
      </article>
      {state.user && <CommentInput postid={post.id} />}
      <Comment postid={post.id} />
    </div>
  );
}
