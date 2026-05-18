import RestaurantsClient from "@/components/customer/restaurants-client";
import axios from "axios";

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
      <main className="max-w-6xl xl:mx-auto w-full px-8 py-10">
        <RestaurantsClient restaurants={allRestaurants} />
      </main>
    </div>
  );
}
