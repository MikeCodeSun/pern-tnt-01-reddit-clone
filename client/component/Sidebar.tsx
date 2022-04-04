import React from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useGlobleContext } from "../context/context";

export default function Sidebar({ create, subname }) {
  const { data } = useSWR("/sub/topsub");
  const { state } = useGlobleContext();
  // console.log(data);
  const router = useRouter();
  if (!data) {
    return <h1 className="mt-5 text-center ">No sidebar</h1>;
  }

  return (
    <div className="hidden w-1/5 p-3 ml-5 bg-white rounded shadow-lg h-72 md:block">
      {data.subs.map((sub, index) => {
        return (
          <Link href={`/r/${sub.name}`} key={index}>
            <div
              key={index}
              className="flex items-center p-1 pb-2 border-b-2 border-gray-400 cursor-pointer"
            >
              <h5>{index + 1}</h5>
              <Image
                src={`http://localhost:4000/img/${sub.coalesce}`}
                width={30}
                height={30}
                className="rounded-full "
              />
              <p>{sub.name}</p>
            </div>
          </Link>
        );
      })}
      {create ? (
        <div className="mt-5">
          <Link href={`/r/${subname}/submit`}>
            <a className="mt-5 button sign-button">post</a>
          </Link>
        </div>
      ) : (
        <div className="mt-5">
          <Link href={`/newSub`}>
            <a className="mt-5 button sign-button">sub</a>
          </Link>
        </div>
      )}
    </div>
  );
}
