import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { useRouter } from "next/router";
import api from "../../../axios";

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
    session: async ({ session, token }: any) => {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
