"use client";
import CategoryList from "@/components/admin/category-list";
import FoodItems from "@/components/admin/food-items";
import { Category } from "@/types/admin/Category";
import { Item } from "@/types/admin/Item";
import { Restaurant } from "@/types/admin/Restaurant";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogPostPage() {
  const { id } = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const [searchItemTxt, setSearchItemTxt] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [isItemPartSelected, setIsItemPartSelected] = useState<boolean>(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
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

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/restaurants/${id}/categories`,
      );
      console.log(res.data);
      setCategories(res.data.data);
    } catch (err) {
      setError(err.response.data.message);
      console.log(err.response.data.message);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/restaurants/${id}/items`,
        {
          params: {
            search: searchItemTxt,
            category: selectedCategoryName,
          },
        },
      );
      console.log(res.data);
      setItems(res.data.data);
    } catch (err) {
      setError(err.response.data.message);
      console.log(err.response.data.message);
    }
  };

  useEffect(() => {
    fetchRestaurant();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [searchItemTxt, selectedCategoryName]);

  if (error) {
    return <h1 className="text-center font-bold text-2xl">{error}</h1>;
  }

  return restaurant ? (
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
          items={items}
          categories={categories}
          searchItemTxt={searchItemTxt}
          onSearchItemTxt={setSearchItemTxt}
          selectedCategoryName={selectedCategoryName}
          onSetSelectedCategoryName={setSelectedCategoryName}
        />
      ) : (
        <CategoryList categories={categories} />
      )}
    </div>
  ) : (
    <div>
      <p className="font-md">{error ? error : "Loading..."}</p>
    </div>
  );
}
