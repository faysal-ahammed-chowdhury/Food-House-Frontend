import { Item } from "@/types/admin/Item";
import { Tag } from "lucide-react";

export default function ItemCard({ item }: { item: Item }) {
  return (
    <div className="shadow-md rounded-xl overflow-hidden bg-white border border-gray-200">
      <div className="relative">
        <div className="absolute right-5 top-5">
          <p
            className={`${!item.isAvailable ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"}
            px-3 py-1 rounded-full font-medium`}
          >
            {item.isAvailable ? "Available" : "Unavailable"}
          </p>
        </div>
        <div className="w-full h-56 bg-gray-100">
          {item.imageUrl && (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/admin/images/${item.imageUrl}`}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
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
