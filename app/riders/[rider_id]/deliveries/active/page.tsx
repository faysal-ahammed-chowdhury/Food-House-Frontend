"use client";

import { ShoppingBag, MapPin, ChevronRight } from "lucide-react";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { OrderStatus } from "@/enums/order-status";

export default function ActiveDeliveries({
  params,
}: {
  params: Promise<{ rider_id: string }>;
}) {
  const { rider_id } = use(params);

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);

  // track picked orders
  

  // FETCH ACTIVE ORDERS
  async function fetchActiveDeliveries() {
    try {
      setLoading(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/rider/${rider_id}/running-orders`, {withCredentials: true}
      );

      setDeliveries(res.data);

    } catch (error) {
      console.error("Error fetching active deliveries:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActiveDeliveries();
  }, [rider_id]);

  // PICK UP ACTION
  async function handlePickUp(orderId: number) {
    try {

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/rider/picked`,
        {
          orderId,
          riderId:Number(rider_id),
        },{withCredentials: true}
      );

      // update UI instantly
      setDeliveries((prev: any) =>
        prev.map((item: any) =>
          item.orderId === orderId ? { ...item, status: OrderStatus.PICKED } : item
        )
      );

    } catch (error:any) {
      //console.error("Pick up failed:", error);
      console.error(error.response?.data || error)
    }
  }
  async function handleDeliver(orderId: number) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/rider/delivered`,
        {
          orderId,
          riderId:Number(rider_id)
        },{withCredentials: true}
      );
      //remove from UI after delivery
      setDeliveries((prev: any) => prev.filter((item: any) => item.orderId !== orderId)
    );
    }
    catch (error) {
    console.error("Delivery failed:", error);
  }
  }


  return (
    <div className="flex flex-1">
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800">
              Active Deliveries
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Orders you are currently delivering
            </p>
          </header>

          {/* LOADING */}
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : deliveries.length === 0 ? (
            /* EMPTY STATE */
            <div className="bg-white border border-slate-200 rounded-[2.5rem] min-h-[450px] flex items-center justify-center p-8 shadow-sm">
              <div className="text-center">
                <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
                <h2 className="text-2xl font-black text-slate-800 mb-2">
                  No active deliveries
                </h2>
                <p className="text-slate-500 font-medium">
                  Accept a request to get started.
                </p>
              </div>
            </div>
          ) : (
            /* TABLE */
            <div className="w-full overflow-x-auto">
              <table className="w-full bg-white rounded-2xl shadow border overflow-hidden">

                {/* HEADER */}
                <thead className="bg-slate-100 text-slate-700 text-sm">
                  <tr>
                    <th className="p-4 text-left">Order</th>
                    <th className="p-4 text-left">Restaurant → Customer</th>
                    <th className="p-4 text-left">Pickup</th>
                    <th className="p-4 text-left">Drop</th>
                    <th className="p-4 text-left">Earn</th>
                    <th className="p-4 text-left">Time</th>
                    <th className="p-4 text-left">Payment</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {deliveries.map((req: any) => (
                    <tr key={req.orderId} className="border-t hover:bg-slate-50">

                      <td className="p-4 font-semibold">
                        #{req.orderId}
                      </td>

                      <td className="p-4 text-sm text-gray-600">
                        {req.restaurantName} → {req.customerName}
                      </td>

                      <td className="p-4 text-sm ">
                        {req.restaurantAddress}
                      </td>

                      <td className="p-4 text-sm">
                         {req.customerAddress}
                      </td>

                      <td className="p-4 font-semibold text-green-600">
                        ৳{req.deliveryFee}
                      </td>

                      <td className="p-4 text-sm text-gray-500">
                        {req.estimatedDeliveryTime} min
                      </td>

                      <td className="p-4 text-sm">
                        {req.paymentMethod}
                      </td>

                      {/* ACTION */}
                      <td className="p-4 text-center">
                        <div className="flex justify-center">

                          {(req.status === OrderStatus.PREPARING || req.status === OrderStatus.RIDER_ASSIGNED) ? (
                            <p className="text-sm text-gray-500">Wait for restaurant to prepare</p>
                          ) : (
                            <>
                              <button
                                onClick={() => handlePickUp(req.orderId)}
                                disabled={req.status === OrderStatus.PICKED}
                                className={`px-4 py-2 rounded-lg text-sm mr-3 ${
                                  req.status === OrderStatus.PICKED
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-600 text-white"
                                }`}
                              >
                                Pick Up
                              </button>

                              <button
                                onClick={() => handleDeliver(req.orderId)}
                               disabled={req.status !== OrderStatus.PICKED}
                                className={`px-4 py-2 rounded-lg text-sm ${
                                  req.status !== OrderStatus.PICKED
                                    ?  "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-green-500 hover:bg-green-600 text-white"
                                }`}
                              >
                                Deliver
                              </button>
                            </>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}