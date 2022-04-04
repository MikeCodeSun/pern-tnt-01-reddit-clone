import React from "react";
import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
import classNames from "classnames";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
dayjs.extend(RelativeTime);
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import userImg from "../pages/asset/user-avatar.png";
import Axios from "axios";

export default function Comment({ postid }) {
  const { data } = useSWR(`/post/${postid}/comment`);
  // console.log(postid);

  const handleVote = async (
    value: number,
    postId: number,
    commentId: number
  ) => {
    try {
      const vote = await Axios.post("/vote", { value, postId, commentId });
      console.log(vote);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(data);
  if (!data) return <h1 className="mt-5 text-center ">No Posts</h1>;
  return (
    <>
      <section className="w-1/2 mx-auto mt-5 ">
        {data.map((comment) => {
          // console.log(comment);

          return (
            <article
              key={comment.id}
              className="flex max-w-xl mb-5 capitalize bg-white border rounded cursor-pointer hover:border-black"
            >
              <div className="flex flex-col items-center w-10 pt-2 mr-1 text-center bg-gray-50">
                <div
                  className={classNames("hover:text-blue-600 ", {
                    "text-blue-500": comment.userVote === 1,
                  })}
                  onClick={() => handleVote(1, postid, comment.id)}
                >
                  <FaArrowUp />
                </div>
                <div className="text-sm">{comment.voteScore}</div>
                <div
                  className={classNames("hover:text-red-600", {
                    "text-red-500": comment.userVote === -1,
                  })}
                  onClick={() => handleVote(-1, postid, comment.id)}
                >
                  <FaArrowDown />
                </div>
              </div>

              <div className="w-full p-1 bg-white">
                <div className="flex items-center mb-2">
                  <div className="relative w-5 h-5 mr-1">
                    <Image src={userImg} layout="fill" objectFit="cover" />
                  </div>
                  <Link href={`/r/${comment.subname}`}>
                    <a>
                      <p className="mr-1 font-bold">/{comment.subname}</p>
                    </a>
                  </Link>
                  <p className="mr-1 text-xs">post by {comment.username}</p>
                  <p className="mr-1 text-xs">
                    {dayjs(comment.created_at).fromNow()}
                  </p>
                </div>
                <Link href={`/r/${comment.subname}/${comment.id}`}>
                  <div className="mb-2">
                    <h5 className="font-bold">{comment.title}</h5>
                    <p>{comment.body}</p>
                  </div>
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
