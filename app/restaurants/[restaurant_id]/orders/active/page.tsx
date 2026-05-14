"use client";

import AuthContext from "@/contexts/auth/auth-context";
import { OrderStatus } from "@/enums/order-status";
import { UserRoles } from "@/enums/user-roles.enum";
import axios from "axios";
import { use, useContext, useEffect, useState } from "react";

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

type FilterStatus = "ALL" | OrderStatus.PENDING | OrderStatus.ACCEPTED | OrderStatus.RIDER_ASSIGNED | OrderStatus.PREPARING | OrderStatus.READY | OrderStatus.PICKED;

export default function ActiveOrders({ params }: { params: Promise<{ restaurant_id: string }>}) {
  const { restaurant_id } = use(params);
  const authContext = useContext(AuthContext);
  const [allactiveOrders, setAllActiveOrders] = useState<any[]>([]);
  const all_status = [OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.RIDER_ASSIGNED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.PICKED];
  
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>("ALL");
  const [count, setCount] = useState(0);
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
      handleFilter(currentFilter);
    }
    catch{console.error("Error fetching active orders");}
  }

  function handleFilter(status: FilterStatus) {
    setCurrentFilter(status);
    const z = allactiveOrders.filter(
        (order) =>
        currentFilter === "ALL" || order.status === currentFilter
      ).length;
    setCount(z);
  }

  async function cancelOrder(orderId: string, curStatus: OrderStatus) {
    if(curStatus === OrderStatus.PICKED){
      alert("Cannot cancel an order that has already been picked up by the rider.");
      return;
    }
    if(!confirm("Are you sure you want to cancel this order?")){return;}
    try{
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/orderStatus/${orderId}/${OrderStatus.CANCELLED}`;
      const response = await axios.patch(RQ_URL,{}, {withCredentials: true});
      if(response.status === 200){
        alert("Order cancelled successfully.");
        setAllActiveOrders((prev) => prev.filter((order) => order.orderId !== orderId));
      }
    }
    catch{
      alert("Error cancelling order. Please try again.");
    }
  }

  async function nextOrderStatus(orderId: string, curStatus: OrderStatus) {
    let nextStatus: OrderStatus | null = null;
    if(curStatus === OrderStatus.ACCEPTED){
      alert("Please wait for the rider to be assign.");
      return;
    }
    if(curStatus === OrderStatus.READY){
      alert("Please wait for the rider to pick up the order.");
      return;
    }

    if(curStatus === OrderStatus.RIDER_ASSIGNED){
      if(!confirm("Ready to Prepare Meal?")){return;}
    }
    if(curStatus === OrderStatus.PREPARING){
      if(!confirm("Meal is Ready? Wait for the rider to pick it up.")){return;}
    }
    
    switch(curStatus){
      case OrderStatus.PENDING:
        nextStatus = OrderStatus.ACCEPTED;
        break;
      case OrderStatus.RIDER_ASSIGNED:
        nextStatus = OrderStatus.PREPARING;
        break;
      case OrderStatus.PREPARING:
        nextStatus = OrderStatus.READY;
        break;
      default:
        nextStatus = null;
    }

    if(!nextStatus){return;}

    try{
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/orderStatus/${orderId}/${nextStatus}`;
      const response = await axios.patch(RQ_URL,{}, {withCredentials: true});
      if(response.status === 200){
        if(curStatus === OrderStatus.PENDING){
          alert("Order accepted successfully. Please wait for the rider to be assign.");
        }
        setAllActiveOrders((prev) => prev.map((order) => order.orderId === orderId ? {...order, status: nextStatus} : order));
      }
    }
    catch{
      alert("Error updating order status. Please try again.");
    }
  }


  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Orders</h1>
          <p className="text-slate-500 mt-1">View your restaurant's active orders</p>
        </div>

        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          {(["ALL", ...all_status] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => handleFilter(status)}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                  currentFilter === status ? "bg-[#E91E63] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                }`
              }
            >
              {status}
            </button>
          ))}
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
              order.status === currentFilter || currentFilter === "ALL" ?  (
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
                      <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full py-0.5 shadow-sm shadow-red-200"
                        onClick={() => cancelOrder(order.orderId, order.status as OrderStatus)}
                      >
                        ✕
                      </button>
                      <> </>
                      <span className={`inline-block w-28 py-1.5 rounded-lg text-[10px] font-black shadow-sm text-white ${statusColors[order.status as OrderStatus] || "bg-gray-400 text-white"}`}>
                        {order.status}
                      </span>
                      <> </>
                      <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full py-0.5 shadow-sm shadow-green-200"
                        onClick={() => nextOrderStatus(order.orderId, order.status as OrderStatus)}
                      >
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
              ):(null)
            ))}
          </tbody>
        </table>
        { count === 0 &&  (
          <div className="p-20 text-center text-gray-400 font-medium">
            No {currentFilter} orders found.
          </div>
        )}
      </div>
    </>
  );
} 