import { OrderStatus } from "@/enums/order-status";
import { Order } from "@/types/admin/Order";
import { Eye } from "lucide-react";
import Link from "next/link";

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

export default function OrderTableItem({ order }: { order: Order }) {
  return (
    <>
      <tr className="hover:bg-slate-50/50 transition-colors">
        <td className="px-6 py-5">
          <p className="font-medium text-slate-500">{order.orderId}</p>
        </td>
        <td className="px-6 py-5">
          <p className="font-bold text-slate-900">{order.restaurantName}</p>
        </td>
        <td className="px-6 py-5">
          <p className="font-bold text-slate-900">{order.customerName}</p>
        </td>
        <td className="px-6 py-5">
          <p className="font-bold text-slate-900">{order.riderName}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">
            {new Date(order.orderAt).toLocaleString()}
          </p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{order.paymentMethod}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{order.subtotal} TK</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{order.deliveryFee} TK</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{order.discountAmount} TK</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{order.total} TK</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{order.commissionAmount} TK</p>
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

        <td>
          <div className="flex justify-center gap-3 text-gray-500">
            <button className="cursor-pointer">
              <Link href={`/admin/orders/${order.orderId}`}>
                <Eye size={16} />
              </Link>
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}
