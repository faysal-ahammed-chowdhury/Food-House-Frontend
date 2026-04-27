"use client";
import FoodItems from "@/components/admin/food-items";
import { Restaurant } from "@/types/admin/Restaurant";
import axios from "axios";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogPostPage() {
  const { id } = useParams();

  const [isItemPartSelected, setIsItemPartSelected] = useState<boolean>(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string>("");

  const fetchRestaurant = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/restaurants/${id}`,
      );
      console.log(res.data);
      setRestaurant(res.data.data);
    } catch (err) {
      setError(err.response.data.message);
      console.log(err.response.data.message);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  if (error) {
    return <h1 className="text-center font-bold text-2xl">{error}</h1>;
  }

  return restaurant ? (
    <div>
      <div className="flex justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{restaurant.user.name} - Menu</h1>
          <p className="text-gray-500 text-lg">
            Manage items and categories for {restaurant?.user.name}
          </p>
        </div>
        <div>
          <div className="flex gap-3">
            <button className="bg-gray-300 text-black-900 cursor-pointer px-5 py-3 rounded-lg flex items-center gap-1">
              <Plus size={18}></Plus>
              <span>New Category</span>
            </button>
            <button className="bg-pink-500 cursor-pointer px-5 py-3 text-white rounded-lg flex items-center gap-1">
              <Plus size={18}></Plus>
              <span>Add New Item</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 border-b border-gray-200">
        <button
          onClick={() => setIsItemPartSelected(true)}
          className={`cursor-pointer px-8 pb-2 text-gray-500 font-bold border-b-2 border-gray-100 hover:text-black ${isItemPartSelected && "border-pink-500 text-pink-500 hover:text-pink-500"}`}
        >
          Food Items
        </button>
        <button
          onClick={() => setIsItemPartSelected(false)}
          className={`cursor-pointer px-8 pb-2 text-gray-500 font-bold border-b-2 border-gray-100 hover:text-black  ${!isItemPartSelected && "border-pink-500 text-pink-500 hover:text-pink-500"}`}
        >
          Categories
        </button>
      </div>

      {isItemPartSelected ? (
        <FoodItems restaudantId={restaurant.restaurantId} />
      ) : null}
    </div>
  ) : (
    <div>
      <p className="font-md">{error ? error : "Loading..."}</p>
    </div>
  );
}
