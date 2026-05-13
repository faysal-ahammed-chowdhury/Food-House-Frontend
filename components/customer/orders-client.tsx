"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios"; 

export default function OrdersClient(
  { initialActiveOrders, initialPastOrders }: { initialActiveOrders: any[]; initialPastOrders: any[]; }) {
  
  const [activeOrders, setActiveOrders] = useState(initialActiveOrders);
  const pastOrders = initialPastOrders;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-50 text-orange-500 border-yellow-200";
      case "ACCEPTED": return "bg-indigo-50 text-indigo-600 border-indigo-200";
      case "RIDER_ASSIGNED": return "bg-teal-50 text-teal-600 border-teal-200";
      case "PREPARING": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "READY": return "bg-orange-50 text-orange-600 border-orange-200";
      case "PICKED": return "bg-blue-50 text-blue-600 border-blue-200";
      case "DELIVERED": return "bg-green-50 text-green-600 border-green-200";
      case "CANCELLED": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setActiveOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: "CANCELLED" } : order
      )
    );
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL ;
      await axios.delete(`${API_URL}/customers/1/orders/${orderId}`);
      
      console.log(`Successfully deleted order #${orderId} from the database!`);
    } catch (error) {
      console.error("Failed to cancel order in the database:", error);
      alert("Something went wrong trying to cancel the order. Please try again.");
      
      setActiveOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: "PENDING" } : order
        )
      );
    }
  };

  return (
    <>
      {/* --- ACTIVE ORDERS SECTION --- */}
      <div className="mb-12">
        <div className="mb-6">
          <h1 className="text-[2rem] font-bold text-[#1a202c] mb-1">
            Active Orders
          </h1>
          <p className="text-gray-500">Your current orders</p>
        </div>

        {activeOrders.length === 0 ? (
           <p className="text-gray-500 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             No active orders right now.
           </p>
        ) : (
          <div className="flex flex-col gap-4">
            {activeOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {order.restaurant}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">
                    Order #{order.orderId} •{" "}
                    {new Date(order.orderAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 font-medium">{order.items}</p>
                </div>

                <div className="text-left md:text-right flex flex-col md:items-end">
                  <p className="text-2xl font-extrabold text-gray-900 mb-1">
                    ৳{order.total}
                  </p>
                  {/* Only show estimated delivery if the order isn't cancelled */}
                  {order.status !== "CANCELLED" && (
                    <p className="text-[#f0146b] font-semibold text-sm mb-3">
                      Estimated Delivery: {order.maxPrepTime + 15} mins
                    </p>
                  )}

                  <div className="flex gap-2 mt-2">
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => handleCancelOrder(order.orderId)}
                        className="border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                    <Link href={`/customer/orders/${order.orderId}`}>
                      <button className="border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- ORDER HISTORY SECTION --- */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-[2rem] font-bold text-[#1a202c] mb-1">
              Order History
            </h2>
            <p className="text-gray-500">View your past orders</p>
          </div>
        </div>

        {pastOrders.length === 0 ? (
          <p className="text-gray-500 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            No past orders found.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {pastOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {order.restaurant}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">
                    Order #{order.orderId} •{" "}
                    {new Date(order.orderAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 text-sm">{order.items}</p>
                </div>

                <div className="text-right flex flex-col items-end gap-3">
                  <p className="text-xl font-extrabold text-gray-900">
                    ৳{order.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}