import { OrderStatus } from "@/enums/order-status";
import { cookies } from "next/headers";
import axios from "axios";
import HistoryFilterButtons from "@/components/restaurants/history_filter_button";


type OrderItem = {
  orderItemId: string | null | undefined;
  itemId: string;
  itemName: string;
  quantity: number;
};

type OrderHistoryEntry = {
  orderId: string;
  customerName: string;
  orderItems: OrderItem[];
  subtotal: number;
  voucherCode: string | null;
  discountAmount: number;
  riderName: string;
  status: string;
  orderAt: string;
};

type FilterStatus = "ALL" | OrderStatus.DELIVERED | OrderStatus.CANCELLED;

async function fetchOrderHistory(restaurant_id: string): Promise<OrderHistoryEntry[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
      
    const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/history/${restaurant_id}`;
    const response = await axios.get(RQ_URL, {
      headers: { Cookie: cookieHeader },
      withCredentials: true,
    });
    return response.data;
  } catch {
    return [];
  }
}


export default async function HistoryOrders({
  params,
  searchParams,
}: {
  params: Promise<{ restaurant_id: string }>;
  searchParams: Promise<{ filter?: string }>;
}) {
  const { restaurant_id } = await params;
  const { filter: rawFilter } = await searchParams;

  const filter: FilterStatus =
    rawFilter === OrderStatus.DELIVERED || rawFilter === OrderStatus.CANCELLED
      ? (rawFilter as FilterStatus)
      : "ALL";


  const orderHistory = await fetchOrderHistory(restaurant_id);

  const filteredOrders = orderHistory.filter((order) => {
    if (filter === "ALL") return true;
    return order.status === filter;
  });

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Previous Orders</h1>
          <p className="text-slate-500 mt-1">View your restaurant's previous orders</p>
        </div>
        <HistoryFilterButtons currentFilter={filter} />
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
              <th className="px-6 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest border-b">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map((order) => (
              <tr key={order.orderId} className="hover:bg-pink-50/20 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-800">
                  {order.customerName}
                </td>
                <td className="px-6 py-5">
                  <div className="text-xs text-gray-600 leading-relaxed">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx}>
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
                  <span
                    className={`inline-block w-24 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      order.status === "DELIVERED"
                        ? "bg-green-500 text-white shadow-sm shadow-green-200"
                        : "bg-[#E91E63] text-white shadow-sm shadow-pink-200"
                    }`}
                  >
                    {order.status}
                  </span>
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
        {filteredOrders.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-medium">
            No {filter.toLowerCase()} orders found.
          </div>
        )}
      </div>
    </>
  );
}
