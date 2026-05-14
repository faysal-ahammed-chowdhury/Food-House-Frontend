import axios from "axios";
import Link from "next/link";
import Navbar from "@/components/customer/navbar";
import RestaurantDetailsClient from "@/components/customer/restaurant-details-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Restaurant Menu | FoodHouse",
};

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>; // Typed as Promise to prevent Next.js 400 errors!
}) {
  const resolvedParams = await params;
  const restaurantId = resolvedParams.id;
  let restaurantData = null;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      redirect("/auth/login");
    }
    const response = await axios.get(`${API_URL}/customers/restaurant-menu/${restaurantId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
      withCredentials: true,
    });
    restaurantData = response.data;
  } catch (error) {
    console.error(`Failed to fetch restaurant #${restaurantId}`, error);
  }

  // Handle 404 if the restaurant doesn't exist
  if (!restaurantData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h1>
          <p className="text-gray-500 mb-6">This restaurant might be closed or doesn't exist.</p>
          <Link href="/customer/home">
            <button className="bg-[#f0146b] text-white px-6 py-2 rounded-lg font-bold">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-gray-100">
        <main className="max-w-6xl xl:mx-auto w-full">
          <Navbar />
        </main>
      </div>

      <main className="max-w-6xl xl:mx-auto w-full px-8 py-8">
        {/* Pass the fully fetched database object to the client */}
        <RestaurantDetailsClient restaurant={restaurantData} />
      </main>
    </div>
  );
}