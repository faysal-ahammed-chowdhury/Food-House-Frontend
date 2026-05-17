//ssr--
import { cookies } from "next/headers";
import axios from "axios";
import { Search, FileText, Eye, TrendingUp, Package, DollarSign } from "lucide-react";

interface DeliveryHistoryItem  {
  orderId: number;
  restaurantName: string;
  customerName: string;
  total: number;
  deliveryFee: number;
  orderAt: string;
}


interface PageProps {
  params: Promise<{ rider_id: string }>;
  searchParams: Promise<{ search?: string; date?: string }>;
}

async function getDeliveredOrders(riderId: string): Promise<DeliveryHistoryItem[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");


    const url = `${process.env.NEXT_PUBLIC_API_URL}/rider/${riderId}/delivered-count`;
    const response = await axios.get(url, { headers: { Cookie: cookieHeader }, withCredentials: true });
    if (response.data === 0) {
      return [];
    }
    try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rider/${riderId}/delivered-orders`, { headers: { Cookie: cookieHeader }, withCredentials: true });
    console.log("Delivered orders response:", response.data);
    return response.data;
  } catch (error) {
    return [];
  }
  }
  catch{}
  return [];
}

function filterHistory(
  history: DeliveryHistoryItem[],
  search: string,
  date: string
): DeliveryHistoryItem[] {
  return history.filter((item) => {
    const matchesSearch =
      !search ||
      item.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      String(item.orderId).includes(search);

    const matchesDate =
      !date ||
      new Date(item.orderAt).toISOString().slice(0, 10) === date;

    return matchesSearch && matchesDate;
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
      <div className={`p-3 rounded-xl ${accent}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-extrabold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default async function DeliveryHistory({ params, searchParams }: PageProps) {
  const { rider_id } = await params;
  const { search = "", date = "" } = await searchParams;

  const history = await getDeliveredOrders(rider_id);
  const filtered = filterHistory(history, search, date);

  const totalEarnings = history.reduce((sum, item) => sum + item.deliveryFee, 0);
  const totalOrders = history.length;
  //customer bill 
  const totalCustomerBill = history.reduce((sum, item) => sum + item.total, 0);
  

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Delivery History
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Rider #{rider_id} · {totalOrders} completed deliveries
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={Package}
            label="Total Deliveries"
            value={String(totalOrders)}
            accent="bg-pink-500"
          />
          <StatCard
            icon={DollarSign}
            label="Total Earnings"
            value={`৳${totalEarnings.toLocaleString()}`}
            accent="bg-emerald-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Customer Bill"
            value={`৳${totalCustomerBill.toLocaleString()}`}
            accent="bg-blue-500"
          />
          
        </div>

        {/* Filters — SSR: submits via GET to reload the page */}
        <form method="GET" className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={16}
            />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by order, restaurant or customer..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none transition-all shadow-sm"
            />
          </div>
          <input
            type="date"
            name="date"
            defaultValue={date}
            className="sm:w-44 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none transition-all shadow-sm"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            Filter
          </button>
          {(search || date) && (
            <a
              href="?"
              className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl transition-colors shadow-sm text-center"
            >
              Clear
            </a>
          )}
        </form>

        {/* Results count */}
        {(search || date) && (
          <p className="text-sm text-slate-500 mb-4">
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{" "}
            <span className="font-semibold text-slate-700">{totalOrders}</span> results
          </p>
        )}

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Order
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Restaurant
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Total
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Earnings
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Date
                  </th>
                
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <div className="bg-slate-100 p-5 rounded-full">
                          <FileText size={40} className="opacity-50" />
                        </div>
                        <p className="text-base font-semibold text-slate-500">
                          {search || date ? "No results match your filters." : "No completed deliveries yet."}
                        </p>
                        <p className="text-sm text-slate-400">
                          {search || date
                            ? "Try adjusting your search or date."
                            : "Orders will appear here once delivered."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.orderId}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-700">#{item.orderId}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {item.restaurantName}
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {item.customerName}
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-semibold">
                        ৳{item.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold">
                          ৳{item.deliveryFee.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {formatDate(item.orderAt)}
                      </td>
                     
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer summary */}
          {filtered.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <p className="text-xs text-slate-400 font-medium">
                {filtered.length} {filtered.length === 1 ? "delivery" : "deliveries"} shown
              </p>
              <p className="text-xs font-semibold text-slate-600">
                Filtered earnings:{" "}
                <span className="text-emerald-600">
                  ৳{filtered.reduce((s, i) => s + i.deliveryFee, 0).toLocaleString()}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
