import type { NextAuthConfig } from "next-auth";

export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  EDITOR: "EDITOR",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname.startsWith("/admin/login");

      if (isOnAdmin && !isOnLogin) {
        if (isLoggedIn) return true;
        return false; // Redirect to signIn page
      } else if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role || Role.EDITOR;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role) || Role.EDITOR;
      }
      return session;
    },
  },
  providers: [], // Configured with credentials provider in auth.ts (Node.js runtime)
};
