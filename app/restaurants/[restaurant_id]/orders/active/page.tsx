"use client";

import AuthContext from "@/contexts/auth/auth-context";
import { OrderStatus } from "@/enums/order-status";
import { UserRoles } from "@/enums/user-roles.enum";
import axios from "axios";
import { use, useContext, useEffect, useState } from "react";

export default function ActiveOrders({ params }: { params: Promise<{ restaurant_id: string }>}) {
  const { restaurant_id } = use(params);
  const authContext = useContext(AuthContext);
  const [allactiveOrders, setAllActiveOrders] = useState<any[]>([]);
  const all_status = [OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.RIDER_ASSIGNED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.PICKED];
  const statusColors = {
    [OrderStatus.PENDING]: "bg-yellow-500 shadow-yellow-100",
    [OrderStatus.ACCEPTED]: "bg-blue-500 shadow-blue-100",
    [OrderStatus.RIDER_ASSIGNED]: "bg-purple-500 shadow-purple-100",
    [OrderStatus.PREPARING]: "bg-orange-500 shadow-orange-100",
    [OrderStatus.READY]: "bg-cyan-500 shadow-cyan-100",
    [OrderStatus.PICKED]: "bg-indigo-500 shadow-indigo-100",
    [OrderStatus.DELIVERED]: "bg-green-500 shadow-green-100",
    [OrderStatus.CANCELLED]: "bg-red-500 shadow-red-100",
  };

  useEffect(() => {
    fetchActiveOrders();
  }, [authContext?.user]);
  async function fetchActiveOrders() {
    if(!authContext?.user){return;}
    if(authContext.user!.role !==  UserRoles.RESTAURANT){return;}
    setAllActiveOrders([]);
    try{
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/activeOrders/${restaurant_id}`;
      const response = await axios.get(RQ_URL, {withCredentials: true});
      setAllActiveOrders(response.data);
      console.log(response.data);
    }
    catch{console.error("Error fetching active orders");}
  }

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Orders</h1>
          <p className="text-slate-500 mt-1">View your restaurant's active orders</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest border-b">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest border-b">Items</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest border-b">Subtotal</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest border-b">Voucher</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest border-b">Discount</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest border-b">Net Total</th>
              <th className="px-6 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest border-b">Status</th>
              <th className="px-6 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest border-b">Rider</th>
              <th className="px-6 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest border-b">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {allactiveOrders.map((order) => ( 
              <tr key={order.orderId} className="hover:bg-pink-50/20 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-800">
                  {order.customerName}
                </td>
                <td className="px-6 py-5">
                  <div className="text-xs text-gray-600 leading-relaxed">
                    {order.orderItems.map((item: any) => (
                      <div key={item.itemId}>
                        {item.itemName} <span className="font-bold text-[#E91E63]">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                  ৳{order.subtotal.toLocaleString()}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="px-2 py-1 bg-pink-50 text-[#E91E63] text-[10px] font-bold rounded border border-pink-100">
                    {order.voucherCode || "—"}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-red-500 font-medium">
                  -৳{order.discountAmount.toFixed(2)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900">
                  ৳{(order.subtotal - order.discountAmount).toFixed(2)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center">


                    <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full py-0.5 shadow-sm shadow-red-200">
                      ✕
                    </button>
                    <> </>
                    <span className={`inline-block w-28 py-1.5 rounded-lg text-[10px] font-black shadow-sm ${statusColors[order.status as OrderStatus] || "bg-gray-400 text-white"}`}>
                      {order.status}
                    </span>
                    <> </>
                    <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full py-0.5 shadow-sm shadow-green-200">
                      ✓
                    </button>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center">
                  {order.riderName || "—"}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center text-sm text-gray-500">
                 {order.orderAt ? new Date(order.orderAt).toLocaleString("en-BD", 
                 {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </>
  );
}