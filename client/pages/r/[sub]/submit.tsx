import Axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useGlobleContext } from "../../../context/context";
import { route } from "next/dist/server/router";

export default function submit() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { state } = useGlobleContext();
  const router = useRouter();
  const { sub: subname } = router.query;
  console.log(subname);

  const submitHandle = async (e: FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Title must not empty");
      return;
    }
    try {
      const post = await Axios.post("/post", { title, body, subname });
      console.log(post);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!state.user) {
      router.back();
    }
  }, []);

  return (
    <>
      <form className="w-1/2 p-5 mx-auto mt-5 bg-white rounded">
        <h1 className="text-lg font-bold text-center">Submit new Post</h1>
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-5 rounded bg-gray-50"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <textarea
          className="w-full mb-5 rounded bg-gray-50"
          placeholder="Write some Post... "
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
          }}
        ></textarea>
        <button
          className="w-full sign-button button"
          onClick={submitHandle}
          // disabled={title.trim() !== ""}
        >
          Submit
        </button>
      </form>
    </>
  );
}
