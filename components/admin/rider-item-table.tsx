import { Rider } from "@/types/admin/Rider";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

export default function RiderTableItem({
  rider,
  onSuccess,
  onEdit,
}: {
  rider: Rider;
  onSuccess: () => void;
  onEdit: (rider: Rider) => void;
}) {
  const {
    riderId,
    user,
    phone,
    riderNid,
    totalDelivery,
    totalEarning,
    isOnline,
  }: Rider = rider;

  const handleDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this rider?");

    if (!ok) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/admin/riders/${riderId}`,
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
          <p className="font-medium text-slate-500">{riderId}</p>
        </td>
        <td className="px-6 py-5">
          <p className="font-bold text-slate-900">{user?.name}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{riderNid}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{user?.email}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{phone}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{totalEarning} TK</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{totalDelivery}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">
            <span
              className={`px-2.5 py-0.5 rounded-full text-sm font-bold ${
                isOnline
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </p>
        </td>

        <td>
          <div className="flex justify-center gap-3 text-gray-500">
            <button
              onClick={() => {
                onEdit(rider);
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
