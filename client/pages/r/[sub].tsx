import React, {
  ChangeEvent,
  ChangeEventHandler,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import PostCard from "../../component/PostCard";
import Head from "next/head";
import Image from "next/image";
// import icon from "../../public/favicon.ico";
import classNames from "classnames";
import { useGlobleContext } from "../../context/context";
import Axios from "axios";
import Sidebar from "../../component/Sidebar";

export default function Sub() {
  const router = useRouter();
  const subName = router.query;
  // console.log(subName);
  const { data: posts } = useSWR(`/sub/${subName.sub}`);
  const { state } = useGlobleContext();
  const inputRef = useRef(null);
  // const [file, setFile] = useState();
  const imgUrl = "http://localhost:4000/img/";

  const upload = async (type: string) => {
    if (state.user?.name !== posts[0].sub.username) return;
    inputRef.current.name = type;
    inputRef.current.click();

    // console.log("click");
    // console.log(file);
  };

  const changeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    // setFile(e.target.files[0]);
    // console.log(file);
    const formData = new FormData();
    formData.append("img", e.target.files[0]);
    formData.append("type", inputRef.current.name);
    try {
      await Axios.post(`/sub/${subName.sub}/img`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (!posts) {
    return <h1 className="mt-5 text-center ">No Posts</h1>;
  }
  // console.log(`${imgUrl}${posts[0].sub.image}`);

  return (
    <>
      <Head>
        <title>Sub</title>
      </Head>

      <input
        type="file"
        name="image"
        id=""
        hidden={true}
        ref={inputRef}
        onChange={changeFile}
      />
      <div className="w-full h-20 bg-blue-500"></div>
      <div className="relative w-full h-32 bg-white">
        <div className="absolute left-1/4" style={{ top: "-20px" }}>
          <Image
            src={
              posts[0]?.sub.image
                ? `${imgUrl}${posts[0].sub.image}`
                : `${imgUrl}default.jpeg`
            }
            width={80}
            height={80}
            className={classNames("rounded-full cover", {
              "cursor-pointer": state.user?.name === posts[0]?.sub.username,
            })}
            onClick={() => upload("image")}
          />
        </div>
        <h1 className="block pt-10 text-2xl font-bold text-center">
          {posts[0]?.sub.name}
        </h1>
      </div>
      <div className="flex w-7/12 max-w-3xl mx-auto mt-5">
        <PostCard posts={posts} />

        <Sidebar create={true} subname={subName.sub} />
      </div>
    </>
  );
}
