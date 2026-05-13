import axios from "axios";
import Navbar from "@/components/customer/navbar";
import OrdersClient from "@/components/customer/orders-client";

export const metadata = {
  title: "Orders | FoodHouse",
};

export default async function OrdersPage() {
  let activeOrders = [];
  let pastOrders = [];

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.get(`${API_URL}/customers/48/orders`);
    
    activeOrders = response.data.activeOrders || [];
    pastOrders = response.data.pastOrders || [];
  } catch (error) {
    console.error("Failed to fetch customer orders.", error);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-gray-100">
        <main className="max-w-7xl xl:mx-auto w-full">
          <Navbar />
        </main>
      </div>

      <main className="max-w-6xl xl:mx-auto w-full px-8 py-10">
        <OrdersClient 
          initialActiveOrders={activeOrders} 
          initialPastOrders={pastOrders} 
        />
      </main>
    </div>
  );
}