import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Axios from "axios";
import Navbar from "../component/Navbar";
import { useRouter } from "next/router";
import { AppProvider } from "../context/context";
import { Fragment } from "react";
import { SWRConfig } from "swr";

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_URI;
Axios.defaults.withCredentials = true;

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = router;
  const authPath = ["/login", "/register"];
  const authRoute = authPath.includes(pathname);

  return (
    <>
      <Head>
        <title>App</title>
      </Head>
      <AppProvider>
        <SWRConfig
          value={{
            fetcher: (url) => Axios.get(url).then((res) => res.data),
            refreshInterval: 0,
          }}
        >
          <Fragment>
            {!authRoute && <Navbar />}
            <Component {...pageProps} />
          </Fragment>
        </SWRConfig>
      </AppProvider>
    </>
  );
}
