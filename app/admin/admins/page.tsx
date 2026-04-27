"use client";
import AddAdminForm from "@/components/admin/add-admin-form";
import AdminTableItem from "@/components/admin/admin-table-item";
import EditAdminForm from "@/components/admin/edit-admin-form";
import MyModal from "@/components/admin/my-modal";
import TableHeader from "@/components/admin/table-header";
import { Admin } from "@/types/admin/Admin";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedEditAdmin, setSelectedEditAdmin] = useState<Admin | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTxt, setSearchTxt] = useState<string>("");

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/admin/admins", {
        params: { search: searchTxt },
      });
      setAdmins(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [searchTxt]);

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const closeEditModal = () => {
    setSelectedEditAdmin(null);
  };

  return (
    <>
      <MyModal
        title="Add New Admin"
        open={showAddModal}
        onClose={closeAddModal}
      >
        <AddAdminForm
          onSuccess={() => {
            fetchAdmins();
            closeAddModal();
            setSearchTxt("");
          }}
        />
      </MyModal>

      {selectedEditAdmin && (
        <MyModal
          title="Edit Admin"
          open={Boolean(selectedEditAdmin)}
          onClose={closeEditModal}
        >
          <EditAdminForm onSuccess={fetchAdmins} admin={selectedEditAdmin} />
        </MyModal>
      )}

      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Admins</h1>
          <p className="text-gray-500 text-lg">Add, edit or remove admin</p>
        </div>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-pink-500 cursor-pointer px-5 py-3 text-white rounded-lg flex items-center gap-1"
          >
            <Plus size={18}></Plus>
            <span>Add Admin</span>
          </button>
        </div>
      </div>

      <div className="mt-5 bg-white p-5 rounded-lg">
        <div className="flex items-center border rounded-lg font-semibold border-gray-300 px-5 py-3 bg-white gap-3">
          <Search size={18} />
          <input
            value={searchTxt}
            onChange={(e) => setSearchTxt(e.target.value)}
            type="text"
            placeholder="Search by Admin ID, Name or Email"
            className="block w-full focus:outline-none"
          />
        </div>
      </div>

      <div className="my-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/50">
                <TableHeader allHeader={["ID", "Name", "Email", "Actions"]} />
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={9}>
                    <p className="text-center py-10 text-lg text-gray-400">
                      Loading...
                    </p>
                  </td>
                </tr>
              ) : admins.length > 0 ? (
                admins.map((admin: Admin) => (
                  <AdminTableItem
                    key={admin.userId}
                    admin={admin}
                    onSuccess={() => {
                      fetchAdmins();
                    }}
                    onEdit={setSelectedEditAdmin}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <p className="text-center py-10 text-lg text-gray-400">
                      No admins found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
