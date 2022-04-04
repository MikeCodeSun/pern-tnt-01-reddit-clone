import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import register_img from "./asset/register-01.jpg";
import React, { FormEvent, useState } from "react";
import classNames from "classnames";
import Axios from "axios";
import { useRouter } from "next/router";
import { useGlobleContext } from "../context/context";

export default function Home() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const { state } = useGlobleContext();

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (agree === false) {
      setErrors({ ...errors, agree: "must agree Agreement!!" });
      return;
    }
    // await Axios.post("/user/register", { name, email, password })
    //   .then((res) => console.log(res))
    //   .catch((err) => {
    //     console.log(err.response.data.errMsg);
    //     setErrors(err.response.data.errMsg);
    //   });

    try {
      const res = await Axios.post("/user/register", { name, email, password });
      console.log(res);
      router.push("/login");
      console.log("x");
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.errMsg);
    }
  };

  if (state.log) {
    router.push("/");
  }

  // console.log(errors);

  return (
    <div className="flex">
      <Head>
        <title>Register</title>
        <meta name="description" content="Example page description" />
      </Head>

      <section className="flex">
        <div className="relative w-40 h-screen ">
          <Image src={register_img} objectFit="cover" layout="fill" />
        </div>
        <div className="flex flex-col justify-center ml-5 capitalize w-72">
          <p className="font-bold">register</p>
          <small>
            By continuing, you are setting up a account and agree to our User
            Agreement and Privacy Policy.
          </small>
          <form className="my-5">
            <div className="mb-5">
              <input
                type="checkbox"
                id="check"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <label htmlFor="check" className="text-sm">
                By continuing, you agree to our User Agreement and Privacy
                Policy.
              </label>
              {errors && errors.agree && (
                <small className="block text-red-600">{errors.agree}</small>
              )}
            </div>
            <input
              type="text"
              placeholder="name"
              className={classNames(
                "w-full p-2 border-2 rounded outline-none bg-gray-50 hover:bg-white focus:bg-white",
                { "border-red-700": errors && errors.name }
              )}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors && errors.name && (
              <small className="block text-red-600">{errors.name}</small>
            )}
            {errors && errors.user && (
              <small className="block text-red-600">{errors.user}</small>
            )}
            <input
              type="email"
              placeholder="email"
              className={classNames(
                "w-full p-2 border-2 rounded outline-none bg-gray-50 hover:bg-white focus:bg-white",
                { "border-red-700": errors && errors.email }
              )}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors && errors.email && (
              <small className="block text-red-600">{errors.email}</small>
            )}
            <input
              type="password"
              placeholder="password"
              className={classNames(
                "w-full p-2 border-2 rounded outline-none bg-gray-50 hover:bg-white focus:bg-white",
                { "border-red-700": errors && errors.password }
              )}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors && errors.password && (
              <small className="block text-red-600">{errors.password}</small>
            )}
            <button
              className="w-full p-2 mt-5 text-white bg-blue-500 rounded-full hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Sign Up
            </button>
          </form>
          <small>
            Already a account?{" "}
            <Link href="/login">
              <a className="font-semibold text-blue-600">LOG IN</a>
            </Link>
          </small>
        </div>
      </section>
    </div>
  );
}
