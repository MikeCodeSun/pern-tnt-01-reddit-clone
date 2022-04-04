import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import classNames from "classnames";
import Link from "next/link";
import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
import {
  FaArrowDown,
  FaArrowUp,
  FaComment,
  FaRegBookmark,
  FaShare,
} from "react-icons/fa";
dayjs.extend(RelativeTime);
import userImg from "../../../pages/asset/user-avatar.png";
import Image from "next/image";
import Axios from "axios";
import { GoComment } from "react-icons/go";

export default function Username() {
  const router = useRouter();
  const { username } = router.query;
  const { data } = useSWR(`/userpost/${username}`);
  console.log(data);
  const handleVote = async (value: number, postId: number) => {
    try {
      await Axios.post("/vote", { value, postId });
    } catch (error) {
      console.log(error);
    }
  };
  if (!data) {
    return <h1 className="mt-5 text-center ">No Posts</h1>;
  }

  return (
    <>
      {data && (
        <div className="max-w-lg mx-auto mt-5">
          {data.subMission.map((item) => {
            if (item.type === "post") {
              return (
                <article
                  key={item.id}
                  className="flex max-w-xl mb-5 capitalize bg-white border rounded cursor-pointer hover:border-black"
                >
                  <div className="flex flex-col items-center w-10 pt-2 mr-1 text-center bg-gray-50">
                    <div
                      className={classNames("hover:text-blue-600 ", {
                        "text-blue-500": item.userVote === 1,
                      })}
                      onClick={() => handleVote(1, item.id)}
                    >
                      <FaArrowUp />
                    </div>
                    <div className="text-sm">{item.voteScore}</div>
                    <div
                      className={classNames("hover:text-red-600", {
                        "text-red-500": item.userVote === -1,
                      })}
                      onClick={() => handleVote(-1, item.id)}
                    >
                      <FaArrowDown />
                    </div>
                  </div>

                  <div className="w-full p-1 bg-white">
                    <div className="flex items-center mb-2">
                      <div className="relative w-5 h-5 mr-1">
                        <Image src={userImg} layout="fill" objectFit="cover" />
                      </div>
                      <Link href={`/r/${item.subname}`}>
                        <a>
                          <p className="mr-1 font-bold">/{item.subname}</p>
                        </a>
                      </Link>
                      <p className="mr-1 text-xs">post by {item.username}</p>
                      <p className="mr-1 text-xs">
                        {dayjs(item.created_at).fromNow()}
                      </p>
                    </div>
                    <Link href={`/r/${item.subname}/${item.id}`}>
                      <div className="mb-2">
                        <h5 className="font-bold">{item.title}</h5>
                        <p>{item.body}</p>
                      </div>
                    </Link>

                    <div className="flex ">
                      <div className="flex items-center p-2 rounded hover:bg-gray-200">
                        <GoComment />
                        <span className="ml-1">
                          {item.commentCount} Comments
                        </span>
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
              );
            }
            if (item.type === "comment") {
              return (
                <article
                  key={item.id}
                  className="flex max-w-xl mb-5 capitalize bg-white border rounded cursor-pointer hover:border-black"
                >
                  <div className="flex flex-col items-center w-10 pt-2 mr-1 text-center bg-gray-50">
                    <FaComment />
                  </div>

                  <div className="w-full p-1 bg-white">
                    <div className="flex items-center mb-2">
                      <div className="relative w-5 h-5 mr-1">
                        <Image src={userImg} layout="fill" objectFit="cover" />
                      </div>
                      <Link href={`/r/${item.subname}`}>
                        <a>
                          <p className="mr-1 font-bold">/{item.subname}</p>
                        </a>
                      </Link>
                      <p className="mr-1 text-xs">post by {item.username}</p>
                      <p className="mr-1 text-xs">
                        {dayjs(item.created_at).fromNow()}
                      </p>
                      <p>post on {item.postname}</p>
                    </div>
                    <Link href={`/r/${item.subname}/${item.id}`}>
                      <div className="mb-2">
                        <p>{item.body}</p>
                      </div>
                    </Link>
                  </div>
                </article>
              );
            }
          })}
        </div>
      )}
    </>
  );
}
