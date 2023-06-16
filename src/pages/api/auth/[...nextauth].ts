import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// import Users from '@/models/Users'

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
        axios.post(`http://localhost:3001/api/user`, {
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
  },
};

export default NextAuth(authOptions);
