"use client";
import CategoryList from "@/components/admin/category-list";
import FoodItems from "@/components/admin/food-items";
import { Category } from "@/types/admin/Category";
import { Item } from "@/types/admin/Item";
import { Restaurant } from "@/types/admin/Restaurant";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const [isItemPartSelected, setIsItemPartSelected] = useState<boolean>(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchRestaurant = async () => {
    try {
      setError("");
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/restaurants/${id}`,
      );
      console.log(res.data);
      setRestaurant(res.data.data);
    } catch (err: any) {
      setError("Something is wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setError("");
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/restaurants/${id}/categories`,
      );
      console.log(res.data);
      setCategories(res.data.data);
    } catch (err) {
      setError("Something is wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
    fetchCategories();
  }, [id]);

  return isLoading ? (
    <p className="text-md">Loading...</p>
  ) : restaurant ? (
    <div>
      <div className="mb-15">
        <h1 className="text-3xl font-bold">{restaurant.user.name} - Menu</h1>
        <p className="text-gray-500 text-lg">
          View items and categories for {restaurant?.user.name}
        </p>
      </div>

      <div className="mt-8 border-b border-gray-200">
        <button
          onClick={() => setIsItemPartSelected(true)}
          className={`cursor-pointer px-8 pb-2 text-gray-500 font-bold border-b-2 border-gray-100 hover:text-black ${isItemPartSelected && "border-pink-500 text-pink-500 hover:text-pink-500"}`}
        >
          Food Items ({items.length})
        </button>
        <button
          onClick={() => setIsItemPartSelected(false)}
          className={`cursor-pointer px-8 pb-2 text-gray-500 font-bold border-b-2 border-gray-100 hover:text-black  ${!isItemPartSelected && "border-pink-500 text-pink-500 hover:text-pink-500"}`}
        >
          Categories ({categories.length})
        </button>
      </div>

      {isItemPartSelected ? (
        <FoodItems
          id={restaurant.restaurantId}
          items={items}
          categories={categories}
          onItemsFetched={setItems}
        />
      ) : (
        <CategoryList
          id={restaurant.restaurantId}
          categories={categories}
          onCategoriesFetched={setCategories}
        />
      )}
    </div>
  ) : (
    <div>
      <p className="font-md">{error}</p>
    </div>
  );
}
