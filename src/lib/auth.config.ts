import type { NextAuthConfig } from "next-auth";

export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  EDITOR: "EDITOR",
  FACULTY: "FACULTY",
  STUDENT: "STUDENT",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as { role?: Role })?.role;
      const pathname = nextUrl.pathname;

      const isOnAdmin = pathname.startsWith("/admin");
      const isOnFaculty = pathname.startsWith("/faculty");
      const isOnPortal = pathname.startsWith("/portal");
      const isOnLogin = pathname === "/login" || pathname === "/admin/login";

      // 1. Guard /admin routes (SUPER_ADMIN or EDITOR only)
      if (isOnAdmin && !pathname.startsWith("/admin/login")) {
        if (!isLoggedIn) return false;
        if (userRole === Role.SUPER_ADMIN || userRole === Role.EDITOR) return true;
        // Non-admins redirected to their appropriate portal
        if (userRole === Role.FACULTY) return Response.redirect(new URL("/faculty", nextUrl));
        return Response.redirect(new URL("/portal", nextUrl));
      }

      // 2. Guard /faculty routes (FACULTY or SUPER_ADMIN only)
      if (isOnFaculty) {
        if (!isLoggedIn) return false;
        if (userRole === Role.FACULTY || userRole === Role.SUPER_ADMIN) return true;
        return Response.redirect(new URL("/portal", nextUrl));
      }

      // 3. Guard /portal routes (Logged in user)
      if (isOnPortal) {
        if (!isLoggedIn) return false;
        return true;
      }

      // 4. Redirect logged in users away from login pages to their respective dashboard
      if (isOnLogin && isLoggedIn) {
        if (userRole === Role.SUPER_ADMIN || userRole === Role.EDITOR) {
          return Response.redirect(new URL("/admin", nextUrl));
        }
        if (userRole === Role.FACULTY) {
          return Response.redirect(new URL("/faculty", nextUrl));
        }
        return Response.redirect(new URL("/portal", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role || Role.STUDENT;
        token.accountStatus = (user as { accountStatus?: string }).accountStatus || "ACTIVE";
        token.profileId = (user as { profileId?: string | null }).profileId || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role) || Role.STUDENT;
        Object.assign(session.user, {
          accountStatus: token.accountStatus as string,
          profileId: token.profileId as string | null,
        });
      }
      return session;
    },
  },
  providers: [],
};
