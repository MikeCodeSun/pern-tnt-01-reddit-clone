import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import redditLogo from "../pages/asset/reddit-logo.png";
import { FaSearch } from "react-icons/fa";
import { useGlobleContext, logout } from "../context/context";
import Axios from "axios";
import { useRouter } from "next/router";

export default function Navbar() {
  const { state, dispatch } = useGlobleContext();
  // console.log(state);
  const [searchValue, setSearchValue] = useState("");
  const [subs, setSubs] = useState([]);
  const router = useRouter();

  const logoutHandle = () => {
    Axios.get("/user/logout")
      .then(() => {
        dispatch(logout());
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const searchHandle = async (subname: string) => {
    setSearchValue(subname);
    try {
      const res = await Axios.get(`/search/sub/${subname}`);
      console.log(res.data);
      setSubs(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(subs.length);

  useEffect(() => {
    if (searchValue === "") {
      setSubs([]);
    }
  }, [searchValue]);

  return (
    <>
      <div className="flex items-center justify-between h-12 px-5 bg-white shadow">
        <div className="relative w-8 h-8 cursor-pointer">
          <Link href="/">
            <a>
              {" "}
              <Image src={redditLogo} layout="fill" objectFit="cover" />
            </a>
          </Link>
        </div>
        <div className="relative flex items-center w-1/2 py-2 border border-transparent rounded hover:border-blue-400 hover:bg-white bg-gray-50">
          <div className="flex items-center px-5">
            <FaSearch />
            <input
              type="text"
              placeholder="Search"
              className="block w-full ml-2 bg-transparent border-none outline-none bg-gray-50"
              value={searchValue}
              onChange={(e) => searchHandle(e.target.value)}
            />
          </div>
          {subs.length > 0 && (
            <div className="absolute z-10 w-full bg-white border-b-2 rounded-b shadow top-10">
              {subs.map((sub) => {
                return (
                  <div
                    key={sub.id}
                    className="p-2 cursor-pointer hover:bg-gray-300"
                    onClick={() => {
                      router.push(`/r/${sub.name}`);
                      setSearchValue("");
                      setSubs([]);
                    }}
                  >
                    <p>{sub.name}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* search drop down */}

        {/* log */}
        {state.log ? (
          <div className="flex items-center">
            <Link href="#">
              <a className="button log-button" onClick={logoutHandle}>
                log out
              </a>
            </Link>
          </div>
        ) : (
          <div className="flex items-center">
            <Link href="/login">
              <a className="button log-button">log in</a>
            </Link>
            <Link href="/register">
              <a className="button sign-button">sign up</a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
