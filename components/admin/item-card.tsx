import { Item } from "@/types/admin/Item";
import { Tag } from "lucide-react";

export default function ItemCard({ item }: { item: Item }) {
  return (
    <div className="shadow-md rounded-xl overflow-hidden bg-white">
      <div>
        <img
          className="w-full"
          src="https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=400&auto=format&fit=crop"
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xl">{item.name}</h2>
          <h2 className="font-bold text-lg text-pink-400">{item.price} TK</h2>
        </div>
        <p className="text-gray-500 my-2">{item.description}</p>
        <div className="flex text-gray-700 items-center my-6 gap-3">
          <Tag size={13} />
          <span className="inline-block px-3 py-1 rounded bg-gray-100 font-bold">
            {item.category.name}
          </span>
        </div>
      </div>
    </div>
  );
}
