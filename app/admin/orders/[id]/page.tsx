"use client";
import { OrderStatus } from "@/enums/order-status";
import { OrderDetails } from "@/types/admin/OrderDetails";
import axios from "axios";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchOrder = async () => {
    try {
      setError("");
      setIsLoading(true);
      const res = await axios.get(`http://localhost:5000/admin/orders/${id}`);
      setOrder(res.data.data);
    } catch (err) {
      setError("Something is wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const cancelOrder = async () => {
    try {
      setIsDeleting(true);
      const res = await axios.patch(
        `http://localhost:5000/admin/orders/${id}/cancel`,
      );
      setOrder(res.data.data);
    } catch (err) {
      setError("Something is wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return isLoading ? (
    <p className="text-md">Loading...</p>
  ) : order ? (
    <div>
      <div className="w-[40%] mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div>
              <Link href="/admin/orders">
                <ArrowLeft size={30} />
              </Link>
            </div>
            <div>
              <h1 className="font-bold text-3xl">Order #{order.orderId}</h1>
              <p className="text-gray-500">
                {new Date(order.orderAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div>
            <span
              className={`
                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
                    ${statusStyles[order.status]}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {order.status}
            </span>
          </div>
        </div>

        <div className="bg-white p-10 rounded-lg mt-10">
          <div className="flex justify-between items-center">
            <div className="relative">
              <div className="absolute top-10.5 left-3.5 h-11.5 border-l-2 border-dashed border-gray-300" />
              <div className="flex items-center gap-5">
                <MapPin size={30} />
                <div>
                  <h3 className="text-gray-500">Order From</h3>
                  <p className="font-bold">
                    {order.restaurantName}, {order.restaurantAddress}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 mt-8">
                <MapPin size={30} />
                <div>
                  <h3 className="text-gray-500">Delivered to</h3>
                  <p className="font-bold">{order.customerAddress}</p>
                </div>
              </div>
            </div>
            <div>
              {order.status !== OrderStatus.DELIVERED &&
                order.status !== OrderStatus.CANCELLED && (
                  <button
                    disabled={isDeleting}
                    onClick={cancelOrder}
                    className="bg-rose-100 text-rose-700 border-rose-200 font-bold cursor-pointer px-5 py-3 rounded-full"
                  >
                    {isDeleting ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-lg mt-10">
          <h2 className="font-bold text-xl mb-5">Order Details</h2>

          {order.orderItems.map((item) => (
            <div
              key={item.itemId}
              className="flex items-center justify-between border-b border-gray-100 py-4"
            >
              <div className="flex gap-3 items-center">
                <p className="text-lg font-bold text-pink-500">
                  {item.quantity}x
                </p>
                <p className="text-md">{item.itemName}</p>
              </div>
              <div>
                <p className="text-md font-bold">
                  {item.itemPrice * item.quantity} TK
                </p>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between mt-5">
            <div className="flex gap-3 items-center">
              <p className="text-gray-500">Subtotal</p>
            </div>
            <div>
              <p className="text-md font-bold">{order.subtotal} TK</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex gap-3 items-center">
              <p className="text-gray-500">Delivery fee</p>
            </div>
            <div>
              <p className="text-md font-bold">{order.deliveryFee} TK</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex gap-3 items-center">
              <p className="text-gray-500">Discount</p>
              {order.voucherCode && (
                <p className="text-green-500 font-medium">
                  ({order.voucherCode})
                </p>
              )}
            </div>
            <div>
              <p className="text-md font-bold">-{order.discountAmount} TK</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-5">
            <div className="flex gap-3 items-center">
              <p className="text-xl font-bold">Total</p>
            </div>
            <div>
              <p className="text-xl font-bold">
                {order.total} TK ({order.paymentMethod})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <p className="font-md">{error}</p>
    </div>
  );
}
