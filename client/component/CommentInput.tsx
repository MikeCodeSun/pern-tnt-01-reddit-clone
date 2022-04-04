import Axios from "axios";
import React, { FormEvent, useState } from "react";

export default function CommentInput({ postid }) {
  const [body, setBody] = useState("");
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (body.trim() === "") return;
    try {
      const comment = await Axios.post(`/post/${postid}/comment`, { body });
      console.log(comment);
      setBody("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <form className="w-full bg-white rounded">
        <p>leave a comment:</p>
        <textarea
          className="w-full bg-gray-50"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <button
          className="block ml-auto button log-button"
          onClick={handleSubmit}
        >
          send
        </button>
      </form>
    </>
  );
}
