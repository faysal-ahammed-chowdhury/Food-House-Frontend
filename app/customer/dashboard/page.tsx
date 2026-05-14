import axios from "axios";
import Navbar from "@/components/customer/navbar";
import MiddleSection from "@/components/customer/middle-section";
import PopularCategories from "@/components/customer/popular-categories";
import TopRestaurants from "@/components/customer/top-resturant";

export const metadata = {
  title: "Home | FoodHouse",
};

export default async function HomePage() {
  let topRestaurantsData = [];

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.get(`${API_URL}/restaurant/top-restaurants`);
    topRestaurantsData = response.data;
  } catch (error) {
    console.error("Failed to fetch top restaurants from NestJS:", error);
  }

  return (
    <main className="max-w-7xl xl:mx-auto w-full">
      <Navbar />
      <MiddleSection />
      <PopularCategories /> 
      <TopRestaurants restaurants={topRestaurantsData} />
    </main>
  );
}