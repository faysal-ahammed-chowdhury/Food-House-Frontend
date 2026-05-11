import Navbar from "@/components/customer/navbar";

export const metadata = {
  title: "Orders | FoodHouse",
};

export default function OrdersPage() {
  // 1. Dummy Data for Active Orders (Currently happening)
  const activeOrders = [
    {
      id: "#ORD-9021",
      restaurant: "Burger Joint",
      items: "2x Double Cheeseburger, 1x Large Fries, 2x Cola",
      total: "$32.50",
      status: "Preparing",
      estimatedTime: "15-20 min",
      date: "May 11, 2026",
    },
  ];

  // 2. Dummy Data for Past Orders (Order History)
  const pastOrders = [
    {
      id: "#ORD-8834",
      restaurant: "Pizza Paradise",
      items: "1x Large Pepperoni Pizza, 1x Garlic Bread",
      total: "$28.00",
      status: "Delivered",
      date: "May 9, 2026",
    },
    {
      id: "#ORD-8712",
      restaurant: "Sushi Zen",
      items: "1x Spicy Tuna Roll, 1x Salmon Sashimi, 1x Miso Soup",
      total: "$42.00",
      status: "Delivered",
      date: "May 5, 2026",
    },
    {
      id: "#ORD-8501",
      restaurant: "Taco Fiesta",
      items: "3x Beef Tacos, 1x Nachos Supreme",
      total: "$21.50",
      status: "Cancelled",
      date: "April 28, 2026",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Preparing":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "Delivered":
        return "bg-green-50 text-green-600 border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Section */}
      <div className="bg-white border-b border-gray-100">
        <main className="max-w-6xl xl:mx-auto w-full">
          <Navbar />
        </main>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl xl:mx-auto w-full px-8 py-10">
        {/* --- ACTIVE ORDERS SECTION --- */}
        <div className="mb-12">
          <div className="mb-6">
            <h1 className="text-[2rem] font-bold text-[#1a202c] mb-1">
              Active Orders
            </h1>
            <p className="text-gray-500">Your current orders</p>
          </div>

          <div className="flex flex-col gap-4">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex justify-between items-center"
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
                    Order {order.id} • {order.date}
                  </p>
                  <p className="text-gray-700 font-medium">{order.items}</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-extrabold text-gray-900 mb-1">
                    {order.total}
                  </p>
                  <p className="text-[#f0146b] font-semibold text-sm">
                    Arriving in {order.estimatedTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
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

          <div className="flex flex-col gap-4">
            {pastOrders.map((order) => (
              <div
                key={order.id}
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
                    Order {order.id} • {order.date}
                  </p>
                  <p className="text-gray-600 text-sm">{order.items}</p>
                </div>

                <div className="text-right flex flex-col items-end gap-3">
                  <p className="text-xl font-extrabold text-gray-900">
                    {order.total}
                  </p>
                  <button className="text-[#f0146b] font-bold text-sm hover:underline flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                    Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
