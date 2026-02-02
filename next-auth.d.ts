import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  type UserRole = "superadmin" | "admin" | "editor";
  type UserType = "admin" | "client";

  interface Session {
    userType?: UserType;
    user: {
      id?: string;
      role?: UserRole;
      clientId?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    clientId?: string;
    userType?: UserType;
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  type UserRole = "superadmin" | "admin" | "editor";
  type UserType = "admin" | "client";

  interface JWT {
    userType?: UserType;
    role?: UserRole;
    userId?: string;
    clientId?: string;
    clientAuthId?: string;
  }
}

