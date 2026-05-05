import { Restaurant } from "@/types/admin/Restaurant";
import axios from "axios";
import { Pencil, Trash2, Utensils } from "lucide-react";
import Link from "next/link";

export default function RestaurantTableItem({
  restaurant,
  onSuccess,
  onEdit,
}: {
  restaurant: Restaurant;
  onSuccess: () => void;
  onEdit: (restaurant: Restaurant) => void;
}) {
  const {
    user,
    restaurantId,
    currentCommissionPercent,
    currentDeliveryFee,
    totalEarning,
    address,
    isOpen,
  }: Restaurant = restaurant;

  const handleDelete = async () => {
    const ok = window.confirm(
      "Are you sure you want to delete this restaurant?",
    );

    if (!ok) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/restaurants/${restaurantId}`,
        { withCredentials: true },
      );
      onSuccess();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <tr className="hover:bg-slate-50/50 transition-colors">
        <td className="px-6 py-5">
          <p className="font-medium text-slate-500">{restaurantId}</p>
        </td>
        <td className="px-6 py-5">
          <p className="font-bold text-slate-900">{user?.name}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{user?.email}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{address}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{currentCommissionPercent}%</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{currentDeliveryFee} TK</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{totalEarning} TK</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">
            <span
              className={`px-2.5 py-0.5 rounded-full text-sm font-bold ${
                isOpen
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isOpen ? "Open" : "Closed"}
            </span>
          </p>
        </td>

        <td>
          <div className="flex justify-center gap-3 text-gray-500">
            <button className="cursor-pointer">
              <Link href={`/admin/restaurants/${restaurantId}/menu`}>
                <Utensils size={16} />
              </Link>
            </button>
            <button
              onClick={() => {
                onEdit(restaurant);
              }}
              className="cursor-pointer"
            >
              <Pencil size={16} />
            </button>
            <button onClick={handleDelete} className="cursor-pointer">
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}
