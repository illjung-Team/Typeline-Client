import Layout from "../components/layout";
import { signOut } from "next-auth/react";
import styled from "styled-components";

export default function Home() {
  return (
    <Layout>
      <h1>NextAuth.js Example</h1>
      <button
        onClick={(e) => {
          signOut();
        }}
      >
        로그아웃
      </button>
    </Layout>
  );
}
