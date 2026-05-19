import Navbar from "@/components/customer/navbar";
import OrderDetailsClient from "@/components/customer/order-details-client";
import axios from "axios";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Order Details | FoodHouse",
};

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let orderData = null;

  const resolvedParams = await params;
  const targetId = resolvedParams.id;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      redirect("/auth/login");
    }
    const response = await axios.get(
      `${API_URL}/customers/orders/${targetId}`,
      {
        headers: {
          Cookie: `token=${token}`,
        },
        withCredentials: true,
      },
    );
    orderData = response.data;
  } catch (error) {
    console.error(`Failed to fetch details for order #${targetId}`, error);
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex flex-col items-center justify-center pt-32">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            We couldn't find the details for this order.
          </p>
          <Link href="/customer/orders">
            <button className="bg-[#f0146b] text-white px-6 py-2 rounded-lg font-bold">
              Back to Orders
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl xl:mx-auto w-full px-8 py-10">
        <OrderDetailsClient order={orderData} />
      </main>
    </div>
  );
}
