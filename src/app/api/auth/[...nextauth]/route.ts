import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { env } from "@/env.mjs";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";

export const authOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GithubProvider({
      clientId: env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
