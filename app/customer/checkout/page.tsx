import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation"; 
import Navbar from "@/components/customer/navbar";
import CheckoutClient from "@/components/customer/checkout-client";

export const metadata = {
  title: "Checkout | FoodHouse",
};

export default async function CheckoutPage({ searchParams }: any) {
  const resolvedParams = await searchParams;
  const restaurantId = resolvedParams.restaurantId || "";
  
  let customerData = null;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL ;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      redirect("/auth/login");
    }
    const response = await axios.get(`${API_URL}/customers/profile`, {
      headers: {
        Cookie: `token=${token}`,
      },
      withCredentials: true,
    });
    
    customerData = response.data;
  } catch (error) {
    console.error("Failed to fetch customer profile for checkout", error);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-gray-100">
        <main className="max-w-6xl xl:mx-auto w-full">
          <Navbar />
        </main>
      </div>

      <main className="max-w-6xl xl:mx-auto w-full px-8 py-10">
        {/* Pass the real customer data into the client component */}
        <CheckoutClient restaurantId={restaurantId} customer={customerData} />
      </main>
    </div>
  );
}