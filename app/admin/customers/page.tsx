"use client";
import AddCustomerForm from "@/components/admin/add-customer-form";
import CustomerTableItem from "@/components/admin/customer-table-item";
import EditCustomerForm from "@/components/admin/edit-customer-form";
import MyModal from "@/components/admin/my-modal";
import TableHeader from "@/components/admin/table-header";
import { Customer } from "@/types/admin/Customer";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedEditCustomer, setSelectedEditCustomer] =
    useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTxt, setSearchTxt] = useState<string>("");

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/admin/customers", {
        params: { search: searchTxt },
      });
      setCustomers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchTxt]);

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const closeEditModal = () => {
    setSelectedEditCustomer(null);
  };

  return (
    <>
      <MyModal
        title="Add New Customer"
        open={showAddModal}
        onClose={closeAddModal}
      >
        <AddCustomerForm
          onSuccess={() => {
            fetchCustomers();
            closeAddModal();
            setSearchTxt("");
          }}
        />
      </MyModal>

      {selectedEditCustomer && (
        <MyModal
          title="Edit Customer"
          open={Boolean(selectedEditCustomer)}
          onClose={closeEditModal}
        >
          <EditCustomerForm
            onSuccess={fetchCustomers}
            customer={selectedEditCustomer}
          />
        </MyModal>
      )}

      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Customers</h1>
          <p className="text-gray-500 text-lg">
            View and manage registered customers
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-pink-500 cursor-pointer px-5 py-3 text-white rounded-lg flex items-center gap-1"
          >
            <Plus size={18}></Plus>
            <span>Add Customer</span>
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
            placeholder="Search by Customer ID, Name, Email or Phone"
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
                    "Customer",
                    "Email",
                    "Phone",
                    "Address",
                    "Total Orders",
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
              ) : customers.length > 0 ? (
                customers.map((customer: Customer) => (
                  <CustomerTableItem
                    key={customer.customerId}
                    customer={customer}
                    onSuccess={() => {
                      fetchCustomers();
                    }}
                    onEdit={setSelectedEditCustomer}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <p className="text-center py-10 text-lg text-gray-400">
                      No customers found
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
