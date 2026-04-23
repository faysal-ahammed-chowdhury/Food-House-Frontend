import { Restaurant } from "@/types/admin/Restaurant";

export default function RestaurantTableItem({
  restaurant,
}: {
  restaurant: Restaurant;
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

  return (
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

      <td></td>
    </tr>
  );
}
