import { LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "./components/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="flex justify-between items-center px-10 py-3 border-b border-gray-100">
        <div className="logo">
          <Image src="/logo.jpeg" height={10} width={180} alt="Logo" />
        </div>
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
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="bg-gray-100 flex-1 p-10">{children}</main>
      </div>
      <footer className="py-5 border-t border-gray-100">
        <p className="text-center">
          © {new Date().getFullYear()} Food House. All rights reserved.
        </p>
      </footer>
    </>
  );
}
