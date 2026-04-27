"use client";
import AddRiderForm from "@/components/admin/add-rider-form";
import EditRiderForm from "@/components/admin/edit-rider-form";
import MyModal from "@/components/admin/my-modal";
import RiderTableItem from "@/components/admin/rider-item-table";
import TableHeader from "@/components/admin/table-header";
import { Rider } from "@/types/admin/Rider";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function RidersPage() {
  const [rider, setRider] = useState<Rider[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedEditRider, setSelectedEditRider] = useState<Rider | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTxt, setSearchTxt] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const fetchRiders = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/admin/riders", {
        params: { search: searchTxt, status: selectedStatus },
      });
      setRider(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, [searchTxt, selectedStatus]);

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const closeEditModal = () => {
    setSelectedEditRider(null);
  };

  return (
    <>
      <MyModal
        title="Add New Rider"
        open={showAddModal}
        onClose={closeAddModal}
      >
        <AddRiderForm
          onSuccess={() => {
            fetchRiders();
            closeAddModal();
            setSearchTxt("");
          }}
        />
      </MyModal>

      {selectedEditRider && (
        <MyModal
          title="Edit Rider"
          open={Boolean(selectedEditRider)}
          onClose={closeEditModal}
        >
          <EditRiderForm onSuccess={fetchRiders} rider={selectedEditRider} />
        </MyModal>
      )}

      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Riders</h1>
          <p className="text-gray-500 text-lg">
            View and manage delivery personnel
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-pink-500 cursor-pointer px-5 py-3 text-white rounded-lg flex items-center gap-1"
          >
            <Plus size={18}></Plus>
            <span>Add Rider </span>
          </button>
        </div>
      </div>

      <div className="mt-5 bg-white p-5 rounded-lg flex gap-5 justify-between items-center">
        <div className="flex-1 flex items-center border rounded-lg font-semibold border-gray-300 px-5 py-3 bg-white gap-3">
          <Search size={18} />
          <input
            value={searchTxt}
            onChange={(e) => setSearchTxt(e.target.value)}
            type="text"
            placeholder="Search by Rider ID, Name or Email"
            className="block w-full focus:outline-none"
          />
        </div>
        <div className="w-32">
          <select
            onChange={(e) => setSelectedStatus(e.target.value)}
            value={selectedStatus}
            className="border rounded-lg font-semibold border-gray-300 px-5 py-3 bg-white focus:outline-none"
          >
            <option value="">All</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      <div className="my-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/50">
                <TableHeader
                  allHeader={[
                    "ID",
                    "Rider",
                    "Rider's NID",
                    "Email",
                    "Phone",
                    "Total Earning",
                    "Total Delivery",
                    "Status",
                    "Actions",
                  ]}
                />
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
              ) : rider.length > 0 ? (
                rider.map((rider: Rider) => (
                  <RiderTableItem
                    key={rider.riderId}
                    rider={rider}
                    onSuccess={() => {
                      fetchRiders();
                    }}
                    onEdit={setSelectedEditRider}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <p className="text-center py-10 text-lg text-gray-400">
                      No riders found
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
