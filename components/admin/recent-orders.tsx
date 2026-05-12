"use client";
import { OrderStatus } from "@/enums/order-status";
import { Order } from "@/types/admin/Order";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import TableHeader from "./table-header";

const statusStyles: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-amber-100 text-amber-700 border-amber-200",
  [OrderStatus.ACCEPTED]: "bg-blue-100 text-blue-700 border-blue-200",
  [OrderStatus.RIDER_ASSIGNED]:
    "bg-indigo-100 text-indigo-700 border-indigo-200",
  [OrderStatus.PREPARING]: "bg-orange-100 text-orange-700 border-orange-200",
  [OrderStatus.READY]: "bg-purple-100 text-purple-700 border-purple-200",
  [OrderStatus.PICKED]: "bg-cyan-100 text-cyan-700 border-cyan-200",
  [OrderStatus.DELIVERED]: "bg-emerald-100 text-emerald-700 border-emerald-200",
  [OrderStatus.CANCELLED]: "bg-rose-100 text-rose-700 border-rose-200",
};

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/recent`,
        {
          withCredentials: true,
        },
      );
      setOrders(res.data.data);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <div className="flex justify-between px-6 py-5 bg-pink-100">
          <h1 className="font-bold text-lg text-pink-800">Recent Orders</h1>
          <Link
            className="text-pink-500 border-b border-pink-500 font-bold text-md m-0 p-0"
            href="/admin/orders"
          >
            View All
          </Link>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="text-center">
            <tr className="border-b border-gray-50 bg-slate-50/50">
              <TableHeader
                allHeader={[
                  "ID",
                  "Restaurant",
                  "Order At",
                  "Total",
                  "Commision",
                  "Status",
                ]}
              />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 text-center">
            {isLoading ? (
              <tr>
                <td colSpan={20}>
                  <p className="text-center py-10 text-lg text-gray-400">
                    Loading...
                  </p>
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order: Order) => (
                <tr key={order.orderId}>
                  <td className="px-6 py-5">
                    <p className="font-medium text-slate-500">
                      {order.orderId}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-500">
                      {order.restaurantName}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-medium text-slate-500">
                      {new Date(order.orderAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-medium text-slate-500">{order.total}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-medium text-slate-500">
                      {order.commissionAmount}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`
                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
                    ${statusStyles[order.status]}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={15}>
                  <p className="text-center py-10 text-lg text-gray-400">
                    No orders found
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
