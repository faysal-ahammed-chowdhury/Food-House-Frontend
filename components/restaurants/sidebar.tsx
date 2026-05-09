"use client";
import { Bike, Box, CookingPot, DollarSign, FileText, Home, List, Notebook, NotebookIcon, PieChart, Settings, Shield, UserIcon, Users, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";



export default function Sidebar({ restaurant_id }: { restaurant_id: string }) {
  const pathname = usePathname();

  const navLinks = [
    { Link: `/restaurants/${restaurant_id}/dashboard`, label: "Dashboard", icon: Home },
    { Link: `/restaurants/${restaurant_id}/menu`, label: "Menu Management", icon: List },
    { Link: `/restaurants/${restaurant_id}/orders/active`, label: "Active Orders", icon: CookingPot },
    { Link: `/restaurants/${restaurant_id}/orders/history`, label: "Order History", icon: FileText },
    { Link: `/restaurants/${restaurant_id}/vouchers`, label: "Vouchers", icon: Box },
    { Link: `/restaurants/${restaurant_id}/profile`, label: "Profile", icon: UserIcon },
    // { Link: `/restaurants/${restaurant_id}/testing`, label: "Testing", icon: Settings },
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
