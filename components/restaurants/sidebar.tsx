"use client";
import { Bike, Box, CookingPot, DollarSign, FileText, Home, List, Notebook, NotebookIcon, PieChart, Shield, UserIcon, Users, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";



export default function Sidebar({ user_id }: { user_id: string }) {
  const pathname = usePathname();

  const navLinks = [
    { Link: `/restaurants/${user_id}/dashboard`, label: "Dashboard", icon: Home },
    { Link: `/restaurants/${user_id}/menu`, label: "Menu Management", icon: List },
    { Link: `/restaurants/${user_id}/orders/active`, label: "Active Orders", icon: CookingPot },
    { Link: `/restaurants/${user_id}/orders/history`, label: "Order History", icon: FileText },
    { Link: `/restaurants/${user_id}/vouchers`, label: "Vouchers", icon: Box },
    { Link: `/restaurants/${user_id}/financials`, label: "Financials", icon: DollarSign },
    { Link: `/restaurants/${user_id}/profile`, label: "Profile", icon: UserIcon },
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
