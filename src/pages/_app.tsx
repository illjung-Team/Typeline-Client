import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

import Layout from "./layout";
import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import axios from "axios";
import useSWR from "swr";
import { useDataStore } from "../store/userdata";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: any) {
  console.log("session", session);

  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
