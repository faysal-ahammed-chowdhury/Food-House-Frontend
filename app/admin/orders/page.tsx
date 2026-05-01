"use client";
import OrderTableItem from "@/components/admin/order-table-item";
import TableHeader from "@/components/admin/table-header";
import { OrderStatus } from "@/enums/order-status";
import { Order } from "@/types/admin/Order";
import axios from "axios";
import { Calendar, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders`,
        {
          params: {
            search,
            status,
            dateFrom,
            dateTo,
          },
        },
      );
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [search, status, dateFrom, dateTo]);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">All Orders</h1>
        <p className="text-gray-500 text-lg">
          Monitor all platform transactions
        </p>
      </div>

      <div className="bg-white p-5 rounded-lg mt-10">
        <div className="flex gap-10">
          <div className="flex flex-1 items-center border rounded-lg font-semibold border-gray-300 px-5 py-3 bg-white gap-3">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="number"
              placeholder="Search by Order ID"
              className="block w-full focus:outline-none"
            />
          </div>
          <div className="w-45">
            <select
              onChange={(e) => setStatus(e.target.value)}
              value={status}
              className="w-full border rounded-lg font-semibold border-gray-300 px-5 py-3 bg-white focus:outline-none"
            >
              <option value="">ALL STATUS</option>
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-10 mt-5">
          <div className="w-[50%]">
            <p className="font-bold text-gray-500">Date From</p>
            <div className="flex items-center border rounded-lg font-semibold border-gray-300 px-5 py-3 bg-white gap-3">
              <Calendar size={18} />
              <input
                value={
                  dateFrom ? new Date(dateFrom).toISOString().split("T")[0] : ""
                }
                onChange={(e) =>
                  setDateFrom(e.target.value ? new Date(e.target.value) : null)
                }
                type="date"
                className="block w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="w-[50%]">
            <p className="font-bold text-gray-500">Date To</p>
            <div className="flex flex-1 items-center border rounded-lg font-semibold border-gray-300 px-5 py-3 bg-white gap-3">
              <Calendar size={18} />
              <input
                value={
                  dateTo ? new Date(dateTo).toISOString().split("T")[0] : ""
                }
                onChange={(e) =>
                  setDateTo(e.target.value ? new Date(e.target.value) : null)
                }
                type="date"
                className="block w-full focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="my-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-center">
              <tr className="border-b border-gray-50 bg-slate-50/50">
                <TableHeader
                  allHeader={[
                    "ID",
                    "Restaurant",
                    "Customer",
                    "Rider",
                    "Order At",
                    "Payment Method",
                    "Subtotal",
                    "Delivery Fee",
                    "Discount",
                    "Total",
                    "Commision",
                    "Status",
                    "Actions",
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
                  <OrderTableItem key={order.orderId} order={order} />
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
    </>
  );
}
