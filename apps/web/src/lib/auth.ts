import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@tixly/database";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@tixly.com" },
        role: { label: "Role", type: "text", placeholder: "SELLER" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email) return null;
        
        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
              role: credentials.role || 'SELLER',
              kycStatus: 'VERIFIED'
            }
          });
        }
        
        return user;
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async session({ session, token }: any) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: "/en/sell",
  }
};
