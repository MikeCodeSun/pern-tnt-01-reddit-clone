import Head from "next/head";
import Post from "../component/Post";

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_URI);

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="reddit-logo.png" />
        <meta property="og:home" content="Home" />
      </Head>
      <Post />
    </>
  );
}

// // This gets called on every request
// export const getServerSideProps: GetServerSideProps = async () => {
//   // Fetch data from external API
//   try {
//     const res = await Axios.get("/post");

//     return { props: { postsa: res.data.posts } };
//   } catch (error) {
//     console.log(error);
//     return { props: { error: "wrong" } };
//   }

//   // Pass data to the page via props
// };
