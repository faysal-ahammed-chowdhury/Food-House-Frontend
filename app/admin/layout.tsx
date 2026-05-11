"use client";
import Sidebar from "@/components/admin/sidebar";
import AuthContext from "@/contexts/auth/auth-context";
import { UserRoles } from "@/enums/user-roles.enum";
import axios from "axios";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  console.log(authContext);

  useEffect(() => {
    if (authContext?.isLoadingUser) return;

    if (!authContext?.user) {
      router.push("/auth/login");
      return;
    }
    if (authContext.user.role === UserRoles.CUSTOMER) {
      router.push("/customer/dashboard");
    } else if (authContext.user.role === UserRoles.RESTAURANT) {
      router.push("/auth/login");
    } else if (authContext.user.role === UserRoles.RIDER) {
      router.push("/rider");
    }
  }, [authContext]);

  const handleLogout = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      router.push("/");
    } catch {}
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-white flex justify-end items-center px-10 py-8 border-b border-gray-100">
        <div className="right flex items-center">
          <Link
            href="/admin/profile"
            className="text-gray-600 flex items-center font-medium hover:text-pink-500 transition"
          >
            <User size={18} />
            <p className="ml-2">{authContext?.user?.name}</p>
          </Link>
          <button onClick={handleLogout} className="cursor-pointer ml-8">
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <Sidebar />
      <main className="min-h-screen w-[calc(100%-260px)] ml-auto bg-gray-100 p-10 mt-22">
        {children}
      </main>
      <footer className="py-5 border-t border-gray-100">
        <p className="text-center">
          © {new Date().getFullYear()} Food House. All rights reserved.
        </p>
      </footer>
    </>
  );
}
