"use client";

import { OrderStatus } from "@/enums/order-status";
import { useRouter, usePathname } from "next/navigation";

type FilterStatus = "ALL" | OrderStatus.DELIVERED | OrderStatus.CANCELLED;

export default function HistoryFilterButtons({ currentFilter }: { currentFilter: FilterStatus }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleFilter(status: FilterStatus) {
    const params = new URLSearchParams();
    if (status !== "ALL") params.set("filter", status);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
      {(["ALL", OrderStatus.DELIVERED, OrderStatus.CANCELLED] as FilterStatus[]).map((status) => (
        <button
          key={status}
          onClick={() => handleFilter(status)}
          className={`px-6 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
            currentFilter === status
              ? "bg-[#E91E63] text-white shadow-md"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
