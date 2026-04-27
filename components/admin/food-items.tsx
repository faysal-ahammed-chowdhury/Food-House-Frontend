"use client";
import { Item } from "@/types/admin/Item";
import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import ItemCard from "./item-card";

export default function FoodItems({ restaudantId }: { restaudantId: number }) {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTxt, setSearchTxt] = useState<string>("");
  const [selectedCategoryName, setsSlectedCategoryName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const fetchItems = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/restaurants/${restaudantId}/items`,
        {
          params: {
            search: searchTxt,
            categoryName: selectedCategoryName,
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
    console.log("here");

    fetchItems();
  }, [searchTxt]);

  return (
    <div>
      <div className="mt-8 bg-white p-5 rounded-lg flex gap-5 justify-between items-center">
        <div className="flex-1 flex items-center border rounded-lg font-semibold border-gray-300 px-5 py-3 bg-white gap-3">
          <Search size={18} />
          <input
            value={searchTxt}
            onChange={(e) => setSearchTxt(e.target.value)}
            type="text"
            placeholder="Search Items"
            className="block w-full focus:outline-none"
          />
        </div>
        <div>
          <select
            onChange={(e) => setsSlectedCategoryName(e.target.value)}
            value={selectedCategoryName}
            className="border rounded-lg font-semibold border-gray-300 px-5 py-3 bg-white focus:outline-none"
          >
            <option value="">All Categories</option>
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
