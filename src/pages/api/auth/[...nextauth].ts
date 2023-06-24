import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { useRouter } from "next/router";
import api from "../../../axios";

export const authOptions: NextAuthOptions = {
  secret: "b7cae8dcb0fb3e997e75ac804d01c492",
  providers: [
    GoogleProvider({
      clientId:
        "249263652098-3uqunp8nck6c7cot7me7n9t6u8048j3k.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  callbacks: {
    async signIn({ user }): Promise<boolean | string> {
      try {
        api.post(`user`, {
          user_id: user.id,
          username: user.name,
          image: user.image,
          email: user.email,
        });
        return true;
      } catch (error: any) {
        console.log(error);
      }
    },
    // session: async ({ session, token }: any) => {
    //   if (session?.user) {
    //     session.user.id = token.uid;
    //   }
    //   return session;
    // },
    // jwt: async ({ user, token }) => {
    //   if (user) {
    //     token.uid = user.id;
    //   }
    //   return token;
    // },
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
