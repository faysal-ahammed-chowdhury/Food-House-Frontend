import { Customer } from "@/types/admin/Customer";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

export default function CustomerTableItem({
  customer,
  onSuccess,
  onEdit,
}: {
  customer: Customer;
  onSuccess: () => void;
  onEdit: (customer: Customer) => void;
}) {
  const { user, customerId, phone, address, totalOrder }: Customer = customer;

  const handleDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this customer?");

    if (!ok) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/customer/${customerId}`,
        {
          withCredentials: true,
        },
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
          <p className="font-medium text-slate-500">{customerId}</p>
        </td>
        <td className="px-6 py-5">
          <p className="font-bold text-slate-900">{user?.name}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{user?.email}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{phone}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{address}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">{totalOrder}</p>
        </td>
        <td className="px-6 py-5">
          <p className="text-slate-900">
            <span
              className={`px-2.5 py-0.5 rounded-full text-sm font-bold ${
                user.isVerified
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.isVerified ? "Verified" : "Unverified"}
            </span>
          </p>
        </td>

        <td>
          <div className="flex justify-center gap-3 text-gray-500">
            <button
              onClick={() => {
                onEdit(customer);
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
