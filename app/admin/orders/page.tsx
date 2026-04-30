"use client";
import OrderTableItem from "@/components/admin/order-table-item";
import TableHeader from "@/components/admin/table-header";
import { Order } from "@/types/admin/Order";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/admin/orders");
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <>
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
