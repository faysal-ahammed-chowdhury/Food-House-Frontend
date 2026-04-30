import Sidebar from "@/components/admin/sidebar";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="flex justify-end items-center px-10 py-8 border-b border-gray-100">
        <div className="right flex items-center">
          <Link
            href="/"
            className="text-gray-600 flex items-center font-medium hover:text-pink-500 transition"
          >
            <User size={18} />
            <p className="ml-2">Faysal Ahammed Chowdhury</p>
          </Link>
          <Link href="/" className="ml-8">
            <LogOut size={18} />
          </Link>
        </div>
      </header>
      <Sidebar />
      <div className="min-h-screen">
        <main className="h-screen w-[calc(100%-260px)] ml-auto bg-gray-100 p-10">
          {children}
        </main>
      </div>
      <footer className="py-5 border-t border-gray-100">
        <p className="text-center">
          © {new Date().getFullYear()} Food House. All rights reserved.
        </p>
      </footer>
    </>
  );
}
