"use client";
import { Category } from "@/types/admin/Category";
import { Item } from "@/types/admin/Item";
import axios from "axios";
import { Search } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ItemCard from "./item-card";

export default function FoodItems({
  id,
  items,
  categories,
  onItemsFetched,
}: {
  id: number;
  items: Item[];
  categories: Category[];
  onItemsFetched: Dispatch<SetStateAction<Item[]>>;
}) {
  const [searchItemTxt, setSearchItemTxt] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");

  const fetchItems = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/restaurants/${id}/items`,
        {
          params: {
            search: searchItemTxt,
            category: selectedCategoryName,
          },
        },
      );
      console.log(res.data);
      onItemsFetched(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchItemTxt, selectedCategoryName]);

  return (
    <div>
      <div className="mt-8 bg-white p-5 rounded-lg flex gap-5 justify-between items-center">
        <div className="flex-1 flex items-center border rounded-lg font-semibold border-gray-300 px-5 py-3 bg-white gap-3">
          <Search size={18} />
          <input
            value={searchItemTxt}
            onChange={(e) => setSearchItemTxt(e.target.value)}
            type="text"
            placeholder="Search Items"
            className="block w-full focus:outline-none"
          />
        </div>
        <div>
          <select
            onChange={(e) => setSelectedCategoryName(e.target.value)}
            value={selectedCategoryName}
            className="border rounded-lg font-semibold border-gray-300 px-5 py-3 bg-white focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-10">
        {items.length ? (
          <div className="grid grid-cols-3 gap-10">
            {items.map((item) => (
              <ItemCard key={item.itemId} item={item} />
            ))}
          </div>
        ) : (
          <div className="shadow py-20 flex flex-col items-center bg-white rounded-lg">
            <span className="bg-gray-200 p-5 rounded-full text-gray-500">
              <Search size={30} />
            </span>
            <h2 className="font-bold text-2xl mt-2 mb-3">No items found</h2>
            <p className="w-80 text-center font-lg text-gray-500">
              Try adjusting your search or category filter to find what you're
              looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
