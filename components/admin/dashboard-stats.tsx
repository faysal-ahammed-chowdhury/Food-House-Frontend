import { DashhboardStats } from "@/types/admin/DashhboardStats";
import axios from "axios";
import { Bike, DollarSign, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { cookies } from "next/headers";

const fetchStats = async (): Promise<DashhboardStats | null> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`,
      {
        headers: { Cookie: cookieHeader },
        withCredentials: true,
      },
    );

    return response.data.data;
  } catch {
    return null;
  }
};

export default async function DashboardStatsComponent() {
  const myStats: DashhboardStats | null = await fetchStats();

  const statsInfo = [
    {
      label: "Platform Earnings",
      value: myStats?.platformEarnings ?? "Null",
      icon: <DollarSign className="h-6 w-6" />,
      currency: "৳",
      isHighlighted: true,
    },
    {
      label: "Total Orders",
      value: myStats?.totalOrders ?? "Null",
      icon: <ShoppingBag className="h-6 w-6 text-[#FF2D75]" />,
      isHighlighted: false,
    },
    {
      label: "Restaurants",
      value: myStats?.totalRestaurant ?? "Null",
      icon: <UtensilsCrossed className="h-6 w-6 text-[#FF2D75]" />,
      isHighlighted: false,
    },
    {
      label: "Riders",
      value: myStats?.totalRider ?? "Null",
      icon: <Bike className="h-6 w-6 text-[#FF2D75]" />,
      isHighlighted: false,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 ">
      {statsInfo.map((stat, index) => (
        <div
          key={index}
          className={`p-6 rounded-xl rounded-[20px] transition-all duration-300 ${
            stat.isHighlighted
              ? "bg-[#FF2D75] text-white shadow-lg shadow-pink-200"
              : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
          }`}
        >
          {/* Top Row: Icon and Trend */}
          <div className="flex justify-between items-start mb-4">
            <div
              className={`${!stat.isHighlighted ? "p-2 bg-pink-50 rounded-lg" : ""}`}
            >
              {stat.icon}
            </div>
          </div>

          {/* Value and Label */}
          <div className="space-y-1">
            <h3
              className={`text-3xl font-extrabold tracking-tight ${stat.isHighlighted ? "text-white" : "text-[#0A1629]"}`}
            >
              {stat.currency && (
                <span className="text-2xl mr-0.5">{stat.currency}</span>
              )}
              {stat.value}
            </h3>
            <p
              className={`text-sm font-medium ${stat.isHighlighted ? "text-pink-100" : "text-[#718096]"}`}
            >
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
