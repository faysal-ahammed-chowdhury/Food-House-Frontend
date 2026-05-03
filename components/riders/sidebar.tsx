"use client";

import { Bike, DollarSign, FileText, Home, UserIcon, Truck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ name }: { name: string }) {
  const pathname = usePathname();

  const navLinks = [
    { Link: `/riders/${name}/dashboard`, label: "Dashboard", icon: Home },
    { Link: `/riders/${name}/deliveries/active`, label: "Active Deliveries", icon: Truck },
    { Link: `/riders/${name}/deliveries/history`, label: "Delivery History", icon: FileText },
    { Link: `/riders/${name}/earnings`, label: "Earnings", icon: DollarSign },
    { Link: `/riders/${name}/profile`, label: "Profile", icon: UserIcon },
  ];

  return (
    <aside className="w-65 p-5">
      <nav className="flex flex-col gap-1">
        {navLinks.map((link) => {
          const active = pathname === link.Link;

          return (
            <Link
              key={link.Link}
              href={link.Link}
              className={`
                flex items-center gap-3 font-medium text-gray-700 hover:text-black hover:bg-gray-100 px-5 py-3 rounded-xl
                ${active && "bg-pink-100 text-pink-500"} transition
              `}
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