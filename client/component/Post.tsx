import React, { useEffect, useState } from "react";
import Axios from "axios";
import userImg from "../pages/asset/user-avatar.png";
import Image from "next/image";
import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(RelativeTime);
import { GoComment } from "react-icons/go";
import { FaShare, FaRegBookmark } from "react-icons/fa";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import classNames from "classnames";
import useSwr from "swr";
import Link from "next/link";
import Sidebar from "./Sidebar";
import useSWRInfinite from "swr/infinite";

export default function Post() {
  const [obId, setObId] = useState("");

  // const { data, mutate } = useSwr(`/post?page=${page}`);
  // console.log(data);
  // const [posts, setPosts] = useState<PostI[]>([]);
  // const fetchPosts = async () => {
  //   try {
  //     const res = await Axios.get("/post");
  //     // console.log(res.data);
  //     setPosts(res.data.posts);
  //   } catch (error) {
  //     console.log(error.response);
  //   }
  // };
  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  const { data, error, isValidating, mutate, size, setSize } = useSWRInfinite(
    (index) => `/post?page=${index}`
  );
  const isInitialLoading = !data && !error;
  const posts = data ? [].concat(...data) : [];
  console.log(posts);

  useEffect(() => {
    if (!posts || posts.length === 0) {
      return;
    }
    if (posts[posts.length - 1].id !== obId) {
      ob(document.getElementById(posts[posts.length - 1].id));
      setObId(posts[posts.length - 1].id);
    }
  }, [posts]);

  const ob = (element: HTMLElement) => {
    if (!element) {
      return;
    }
    const obersever = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSize(size + 1);
          obersever.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    obersever.observe(element);
  };

  const handleVote = async (value: number, postId: number) => {
    try {
      await Axios.post("/vote", { value, postId });
      mutate();
    } catch (error) {
      console.log(error);
    }
  };
  if (!posts) {
    return <h1 className="mt-5 text-center ">No Posts</h1>;
  }

  return (
    <div className="flex w-7/12 max-w-3xl mx-auto mt-5 ">
      <section className="w-full">
        {posts.length === 0 ? (
          <h1>no Post </h1>
        ) : (
          posts.map((post) => {
            // console.log(post);

            return (
              <article
                key={post.id}
                className="flex w-full mb-5 capitalize bg-white border rounded cursor-pointer hover:border-black "
                id={post.id}
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
                        <p className="mx-1 font-bold"> /{post.subname}</p>
                      </a>
                    </Link>
                    <p className="mx-1 text-xs">
                      post by{" "}
                      <Link href={`/r/user/${post.username}`}>
                        <a>{post.username}</a>
                      </Link>
                    </p>
                    <p className="mx-1 text-xs">
                      {dayjs(post.created_at).fromNow()}
                    </p>
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
            );
          })
        )}
      </section>
      <Sidebar create={false} subname={null} />
    </div>
  );
}
