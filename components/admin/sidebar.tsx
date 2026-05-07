"use client";
import {
  Bike,
  List,
  PieChart,
  Shield,
  User,
  Users,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/admin", label: "Overview", icon: PieChart },
  { href: "/admin/restaurants", label: "Restaurants", icon: Utensils },
  { href: "/admin/riders", label: "Riders", icon: Bike },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/admins", label: "Admins", icon: Shield },
  { href: "/admin/orders", label: "All Orders", icon: List },
  { href: "/admin/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-65 p-5 fixed top-0 bg-white h-screen">
      <nav className="flex flex-col gap-1">
        <div className="logo pb-5 px-3">
          <Link href="/admin">
            <Image src="/logo.jpeg" height={10} width={180} alt="Logo" />
          </Link>
        </div>
        {navLinks.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 font-medium text-gray-700 hover:text-black hover:bg-gray-100 px-5 py-3 rounded-xl
               ${active && "bg-pink-100 text-pink-500 hover:bg-pink-100 hover:text-pink-500"} transition`}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
