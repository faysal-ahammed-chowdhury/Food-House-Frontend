"use client";
import AddRestaurantForm from "@/components/admin/add-restaurant-form";
import EditResturantForm from "@/components/admin/edit-restaurant-form";
import MyModal from "@/components/admin/my-modal";
import RestaurantTableItem from "@/components/admin/restaurant-table-item";
import TableHeader from "@/components/admin/table-header";
import { Restaurant } from "@/types/admin/Restaurant";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedEditRestaurant, setSelectedEditRestaurant] =
    useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTxt, setSearchTxt] = useState<string>("");

  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/restaurants`,
        {
          params: { search: searchTxt },
        },
      );
      setRestaurants(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [searchTxt]);

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const closeEditModal = () => {
    setSelectedEditRestaurant(null);
  };

  return (
    <>
      <MyModal
        title="Add New Restaurant"
        open={showAddModal}
        onClose={closeAddModal}
      >
        <AddRestaurantForm
          onSuccess={() => {
            fetchRestaurants();
            closeAddModal();
            setSearchTxt("");
          }}
        />
      </MyModal>

      {selectedEditRestaurant && (
        <MyModal
          title="Edit Restaurant"
          open={Boolean(selectedEditRestaurant)}
          onClose={closeEditModal}
        >
          <EditResturantForm
            onSuccess={fetchRestaurants}
            restaurant={selectedEditRestaurant}
          />
        </MyModal>
      )}

      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Restaurants</h1>
          <p className="text-gray-500 text-lg">
            Add, edit or remove restaurant partners
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-pink-500 cursor-pointer px-5 py-3 text-white rounded-lg flex items-center gap-1"
          >
            <Plus size={18}></Plus>
            <span>Add Restaurant</span>
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
            placeholder="Search by Restaurant ID, Name or Email"
            className="block w-full focus:outline-none"
          />
        </div>
      </div>

      <div className="my-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-center">
              <tr className="border-b border-gray-50 bg-slate-50/50">
                <TableHeader
                  allHeader={[
                    "ID",
                    "Restaurant",
                    "Email",
                    "Address",
                    "Commission",
                    "Delivery Fee",
                    "Total Earning",
                    "Status",
                    "Actions",
                  ]}
                />
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-center">
              {isLoading ? (
                <tr>
                  <td colSpan={9}>
                    <p className="text-center py-10 text-lg text-gray-400">
                      Loading...
                    </p>
                  </td>
                </tr>
              ) : restaurants.length > 0 ? (
                restaurants.map((r: Restaurant) => (
                  <RestaurantTableItem
                    key={r.restaurantId}
                    restaurant={r}
                    onSuccess={() => {
                      fetchRestaurants();
                    }}
                    onEdit={setSelectedEditRestaurant}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <p className="text-center py-10 text-lg text-gray-400">
                      No restaurants found
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
