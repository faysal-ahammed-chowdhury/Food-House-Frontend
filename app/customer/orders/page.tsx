import Navbar from "@/components/customer/navbar";
import OrdersClient from "@/components/customer/orders-client";

export const metadata = {
  title: "Orders | FoodHouse",
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-gray-100">
        <main className="max-w-7xl xl:mx-auto w-full">
          <Navbar />
        </main>
      </div>

      <main className="max-w-6xl xl:mx-auto w-full px-8 py-10">
        <OrdersClient />
      </main>
    </div>
  );
}
