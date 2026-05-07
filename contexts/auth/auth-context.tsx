"use client";
import { User } from "@/types/admin/User";
import { createContext } from "react";

type AuthContextType = {
  user: User | null;
  fetchUser: () => Promise<void>;
  userErr: string;
  isLoadingUser: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
