"use client";
import { User } from "@/types/admin/User";
import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import AuthContext from "./auth-context";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userErr, setUserErr] = useState<string>("");
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  const fetchUser = async () => {
    setUserErr("");
    setIsLoadingUser(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          withCredentials: true,
        },
      );
      setUser(res.data.data);
    } catch {
      setUser(null);
      setUserErr("There is something wrong");
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, fetchUser, isLoadingUser, userErr }}>
      {children}
    </AuthContext.Provider>
  );
}
