import OrdersClient from "@/components/customer/orders-client";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Orders | FoodHouse",
};

export default async function OrdersPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  let activeOrders = [];
  let pastOrders = [];

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.get(`${API_URL}/customers/orders`, {
      headers: {
        Cookie: `token=${token}`,
      },
      withCredentials: true,
    });

    activeOrders = response.data.activeOrders || [];
    pastOrders = response.data.pastOrders || [];
  } catch (error) {
    console.error("Failed to fetch customer orders.", error);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl xl:mx-auto w-full px-8 py-10">
        <OrdersClient
          initialActiveOrders={activeOrders}
          initialPastOrders={pastOrders}
        />
      </main>
    </div>
  );
}
