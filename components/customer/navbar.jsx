"use client";

import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { usePathname } from "next/navigation"; 
import { useContext } from "react";
import AuthContext from "@/contexts/auth/auth-context";

const Navbar = () => {
  const pathname = usePathname();
  const authContext = useContext(AuthContext);

  const isActive = (path) => {
    return pathname === path
      ? "text-[#f0146b] font-bold" 
      : "text-gray-600 hover:text-[#f0146b] transition-colors"; 
  };

  const handleLogout = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true
      });
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  useEffect(() => {
      const pusher = new Pusher(process.env.NEXT_PUBLIC_APP_ID, {
        cluster: process.env.NEXT_PUBLIC_APP_CLUSTER,
      });
      const channel = pusher.subscribe("delivery-channel");
      channel.bind("new-delivery", (data) => {
        alert(data);
      });
    }, []);



  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-white border-b border-gray-100">
      {/* Logo Section */}
      <Link href="/customer/dashboard" className="flex items-center gap-2">
        <Image src="/logo.jpeg" alt="FoodHouse" width={140} height={100} className="object-contain" />
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-8 font-semibold">
        <Link href="/customer/dashboard" className={isActive("/customer/dashboard")}> Home </Link>
        <Link href="/customer/restaurants" className={isActive("/customer/restaurants")}> Restaurants</Link>
        <Link href="/customer/orders" className={isActive("/customer/orders")}> Orders </Link>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-6 text-gray-600">
        
        {/* Profile Icon */}
        <Link href="/customer/profile" className="flex items-center gap-2 cursor-pointer hover:text-pink-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span className="font-medium">
            {authContext?.isLoadingUser ? "Loading..." : authContext?.user?.name || "Guest"}
          </span>
        </Link>

        {/* Cart Icon */}
        <Link href="/customer/cart" className="hover:text-pink-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor"viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </Link>

        {/* 4. Changed <Link> to a <button> with onClick */}
        <button onClick={handleLogout} className="hover:text-pink-500 cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;