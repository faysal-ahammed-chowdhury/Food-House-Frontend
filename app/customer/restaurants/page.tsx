import axios from "axios";
import Navbar from "@/components/customer/navbar";
import RestaurantsClient from "@/components/customer/restaurants-client";

export const metadata = {
  title: "Restaurants | FoodHouse",
};

export default async function RestaurantsPage() {
  let allRestaurants = [];

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.get(`${API_URL}/customers/all-restaurants`);
    allRestaurants = response.data;
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-gray-100">
        <main className="max-w-7xl xl:mx-auto w-full">
          <Navbar />
        </main>
      </div>

      <main className="max-w-6xl xl:mx-auto w-full px-8 py-10">
        <RestaurantsClient restaurants={allRestaurants} />
      </main>
    </div>
  );
}