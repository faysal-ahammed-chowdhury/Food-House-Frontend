import { Admin } from "@/types/admin/Admin";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

export default function AdminTableItem({
  admin,
  onSuccess,
  onEdit,
}: {
  admin: Admin;
  onSuccess: () => void;
  onEdit: (admin: Admin) => void;
}) {
  const { userId, name, email }: Admin = admin;

  const handleDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this admin?");

    if (!ok) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/admin/admins/${userId}`,
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
          <p className="font-medium text-slate-500">{userId}</p>
        </td>
        <td className="px-6 py-5">
          <p className="font-bold text-slate-900">{name}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{email}</p>
        </td>

        <td className="px-6 py-5">
          <div className="flex justify-center gap-3 text-gray-500">
            <button
              onClick={() => {
                onEdit(admin);
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
