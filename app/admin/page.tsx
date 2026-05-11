import DashboardStats from "@/components/admin/dashboard-stats";
import RecentOrders from "@/components/admin/recent-orders";

export default function Dashboard() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <p className="text-gray-500 text-lg">
          Platform-wide statistics and performance
        </p>
      </div>
      <div>
        <DashboardStats />
        <div className="mt-10 grid grid-cols-2 gap-10">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
