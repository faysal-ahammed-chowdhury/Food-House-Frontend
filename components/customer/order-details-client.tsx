"use client";

import Link from "next/link";

export default function OrderDetailsClient({ order }: { order: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-50 text-orange-500 border-yellow-200";
      case "ACCEPTED": return "bg-green-50 text-green-600 border-green-200";
      case "RIDER_ASSIGNED": return "bg-teal-50 text-teal-600 border-teal-200";
      case "PREPARING": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "READY": return "bg-green-50 text-green-600 border-green-200";
      case "PICKED": return "bg-blue-50 text-blue-600 border-blue-200";
      case "DELIVERED": return "bg-green-50 text-green-600 border-green-200";
      case "CANCELLED": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const timelineSteps = [
    {
      key: "PENDING",
      title: "Order Placed",
      desc: "Waiting for restaurant to accept",
    },
    {
      key: "ACCEPTED",
      title: "Accepted",
      desc: "Waiting for a rider to be assigned",
    },
    {
      key: "RIDER_ASSIGNED",
      title: "Rider Assigned",
      desc: "A rider is on the way to the restaurant",
    },
    { key: "PREPARING", title: "Preparing", desc: "Your food is being cooked" },
    {
      key: "READY",
      title: "Ready for Pickup",
      desc: "Food is ready and waiting for rider",
    },
    {
      key: "PICKED",
      title: "Out for Delivery",
      desc: "Rider has picked up your order",
    },
    {
      key: "DELIVERED",
      title: "Delivered",
      desc: "Enjoy your meal!",
    },
  ];

  const currentStatusIndex = timelineSteps.findIndex(
    (s) => s.key === order.status,
  );

  const orderItems = order.orderItems || [];

  return (
    <>
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-start gap-4">
          <Link href="/customer/orders" className="mt-2 text-gray-900 hover:text-[#f0146b] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </Link>
          <div>
            <h1 className="text-[2rem] font-bold text-[#1a202c]">
              Order #{order.orderId}
            </h1>
            <p className="text-gray-500 font-medium">
              {new Date(order.orderAt).toLocaleString()}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-extrabold px-4 py-1.5 rounded-full uppercase border ${getStatusColor(order.status)}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Order Progress Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-extrabold text-[#1a202c] mb-8">
              Order Progress
            </h2>

            {order.status === "CANCELLED" ? (
              <div className="text-center py-6">
                <span className="bg-red-50 text-red-500 font-bold px-6 py-3 rounded-xl border border-red-100">
                  This order was cancelled.
                </span>
              </div>
            ) : (
              <div className="relative pl-2">
                <div className="absolute left-[19px] top-4 bottom-8 w-[2px] bg-gray-100"></div>

                {timelineSteps.map((step, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isActive = index === currentStatusIndex;

                  return (
                    <div key={step.key} className="flex gap-6 relative mb-8 last:mb-0">
                      {/* Icon / Dot */}
                      <div
                        className={`relative z-10 flex items-center justify-center shrink-0 mt-0.5 rounded-full border-4 border-white
                        ${isCompleted ? "bg-[#f0146b] w-8 h-8 -ml-1 shadow-sm" : "bg-gray-200 w-6 h-6"}`}
                      >
                        {isCompleted && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>

                      <div className={isCompleted ? "" : "opacity-60"}>
                        {/* Active is Pink, Completed is Dark Gray, Future is Light Gray */}
                        <h3 className={`font-bold text-lg ${isActive ? "text-[#f0146b]" : isCompleted ? "text-[#1a202c]" : "text-gray-500"}`}>
                          {step.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-extrabold text-[#1a202c] mb-6">
              Order Items
            </h2>

            <div className="flex flex-col gap-4 mb-6">
              {orderItems.map((item: any) => (
                <div
                  key={item.orderItemId || item.itemId}
                  className="flex justify-between items-center"
                >
                  <div className="flex gap-3">
                    <span className="font-extrabold text-[#f0146b]">
                      {item.quantity}x
                    </span>
                    <span className="font-bold text-gray-700">
                      {item.itemName}
                    </span>
                  </div>
                  <span className="font-extrabold text-[#1a202c]">
                    ৳{item.itemPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 flex flex-col gap-3 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>৳{order.deliveryFee}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-500 font-medium">
                  <span>Discount</span>
                  <span>- ৳{order.discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-50">
                <span className="text-lg font-extrabold text-[#1a202c]">
                  Total
                </span>
                <span className="text-xl font-extrabold text-[#1a202c]">
                  ৳{order.total}
                </span>
              </div>

              {/* Displaying the Payment Method */}
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold">Payment Method</span>
                <span className="font-extrabold text-[#f0146b] uppercase bg-pink-50 px-2 py-1 rounded">
                  {order.paymentMethod || "CASH_ON_DELIVERY"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Restaurant Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-extrabold text-[#1a202c] mb-4">
              Restaurant Details
            </h2>
            <h3 className="font-bold text-[#1a202c] mb-2">
              {order.restaurantName}
            </h3>
            <div className="flex items-start gap-2 text-gray-500 text-sm">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{order.restaurantAddress}</span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-extrabold text-[#1a202c] mb-4">
              Customer Details
            </h2>
            <h3 className="font-bold text-[#1a202c] mb-2">
              {order.customerName}
            </h3>
            <div className="flex flex-col gap-3 text-gray-500 text-sm">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{order.customerAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>{order.customer?.phone || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}