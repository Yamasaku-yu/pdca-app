import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NProgress from "nprogress"; // ローディングバー
import "nprogress/nprogress.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const start = () => NProgress.start();
    const end = () => NProgress.done();

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
