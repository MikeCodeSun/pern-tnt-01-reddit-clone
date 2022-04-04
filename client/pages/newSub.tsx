import Head from "next/head";
import React, { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import img from "./asset/register-01.jpg";
import Axios from "axios";
import { useRouter } from "next/router";
import { useGlobleContext } from "../context/context";

export default function newSub() {
  const [subName, setSubName] = useState("");
  const router = useRouter();
  const { state } = useGlobleContext();

  const submitHandle = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const data = await Axios.post("/sub", { name: subName });
      console.log(data);
      router.push(`/r/${subName}`);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    if (!state.user) {
      router.back();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Create Sub</title>
      </Head>
      <section className="flex">
        <div
          className="relative w-40 "
          style={{ height: "calc(100vh - 48px)" }}
        >
          <Image src={img} layout="fill" objectFit="cover" />
        </div>

        <div className="flex items-center ml-5">
          <form className="flex flex-col ">
            <input
              className="p-1 mb-5 rounded"
              type="text"
              placeholder="Sub Name"
              value={subName}
              onChange={(e) => {
                setSubName(e.target.value);
              }}
            />
            <button
              className="w-full button sign-button"
              onClick={submitHandle}
            >
              create sub
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
