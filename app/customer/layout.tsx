"use client";
import Navbar from "@/components/customer/navbar";
import AuthContext from "@/contexts/auth/auth-context";
import { UserRoles } from "@/enums/user-roles.enum";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function CustomerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext?.isLoadingUser) return;
    if (!authContext?.user) {
      return;
    }
    if (authContext.user.role === UserRoles.ADMIN) {
      router.push("/admin");
    } else if (authContext.user.role === UserRoles.RESTAURANT) {
      router.push("/auth/login");
    } else if (authContext.user.role === UserRoles.RIDER) {
      router.push("/auth/login");
    }
  }, [authContext]);

  return (
    <>
      <div className="bg-white border-b border-gray-100">
        <main className="max-w-7xl xl:mx-auto w-full">
          <Navbar />
        </main>
      </div>
      {children}
    </>
  );
}
