import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import register_img from "./asset/register-01.jpg";
import React, { FormEvent, useState } from "react";
import Axios from "axios";
import { useRouter } from "next/router";
import Input from "../component/Input";
import { login, useGlobleContext } from "../context/context";

export default function Home() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<any>({});
  const { state, dispatch } = useGlobleContext();

  console.log(state);

  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    Axios.post("/user/login", { email, password })
      .then((res) => {
        console.log(res.data.user);
        dispatch(login(res.data.user));
        router.back();
      })
      .catch((err) => {
        // console.log(err.response);
        setErrors(err.response.data.errMsg);
      });
  };

  if (state.log) {
    router.push("/");
  }

  return (
    <div className="flex">
      <Head>
        <title>Login</title>
        <meta name="description" content="Example page description" />
      </Head>

      <section className="flex">
        <div className="relative w-40 h-screen ">
          <Image src={register_img} objectFit="cover" layout="fill" />
        </div>
        <div className="flex flex-col justify-center ml-5 capitalize w-72">
          <p className="font-bold">Login</p>
          <small>
            By continuing, you are setting up a account and agree to our User
            Agreement and Privacy Policy.
          </small>
          <form className="my-5">
            <Input
              type="email"
              placeholder="email"
              error={errors.email}
              value={email}
              setValue={setEmail}
            />
            <Input
              type="password"
              placeholder="password"
              error={errors.password}
              value={password}
              setValue={setPassword}
            />
            {/* <input
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
            )} */}
            {/* <input
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
            )} */}
            <button
              className="w-full p-2 mt-5 text-white bg-blue-500 rounded-full hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Login
            </button>
          </form>
          <small>
            Not have a account?{" "}
            <Link href="/register">
              <a className="font-semibold text-blue-600">Register</a>
            </Link>
          </small>
          {/* <button onClick={() => router.push("/")}>home</button> */}
        </div>
      </section>
    </div>
  );
}
