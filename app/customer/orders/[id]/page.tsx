import Navbar from "@/components/customer/navbar";
import OrderDetailsClient from "@/components/customer/order-details-client";

export const metadata = {
  title: "Order Details | FoodHouse",
};

export default async function OrderDetailsPage({ params }: any) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-gray-100">
        <main className="max-w-6xl xl:mx-auto w-full">
          <Navbar />
        </main>
      </div>

      <main className="max-w-6xl xl:mx-auto w-full px-8 py-10">
        <OrderDetailsClient orderId={orderId} />
      </main>
    </div>
  );
}
