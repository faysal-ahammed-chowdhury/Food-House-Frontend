import Navbar from "@/components/customer/navbar";
import RestaurantDetailsClient from "@/components/customer/restaurant-details-client";
import axios from "axios";
import Link from "next/link";

export const metadata = {
  title: "Restaurant Menu | FoodHouse",
};

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const restaurantId = resolvedParams.id;
  let restaurantData = null;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.get(
      `${API_URL}/customers/restaurant-menu/${restaurantId}`,
      {
        withCredentials: true,
      },
    );
    restaurantData = response.data;
  } catch (error) {
    console.error(`Failed to fetch restaurant #${restaurantId}`, error);
  }

  if (!restaurantData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex flex-col items-center justify-center pt-32">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Restaurant Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            This restaurant might be closed or doesn't exist.
          </p>
          <Link href="/customer/dashboard">
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
      <main className="max-w-6xl xl:mx-auto w-full px-8 py-8">
        <RestaurantDetailsClient restaurant={restaurantData} />
      </main>
    </div>
  );
}
