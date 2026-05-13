"use client";

import Header from "@/components/riders/header";
import Sidebar from "@/components/riders/sidebar";
import Footer from "@/components/riders/footer";
import Statcard from "@/components/riders/statcard";
import axios from "axios";
import { use, useState, useEffect } from "react";

export default function Dashboard({ params }: { params: Promise<{ rider_id: string }> }) {
  const { rider_id } = use(params);
  const [dashboard, setDashboard] = useState({
    activeDeliveries: 0,
    availableRequests: 0,
    todaysEarnings: 0,
    completedOrders: 0,
  });
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/rider/riders/${rider_id}/dashboard`;
      const response = await axios.get(RQ_URL);
      if (response.status === 200) {
        const data = response.data.data;
        setDashboard({
          activeDeliveries: data.activeDeliveries,
          availableRequests: data.availableRequests,
          todaysEarnings: data.todaysEarnings,
          completedOrders: data.completedOrders,
        });
        setIsOnline(data.isOnline);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }

  const toggleStatus = async () => {
    try {
      const newStatus = !isOnline;
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/rider/riders/${rider_id}/status`, {
        isOnline: newStatus,
      });
      setIsOnline(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header with toggle functionality */}
      <Header rider_id={rider_id} isOnline={isOnline} toggleStatus={toggleStatus} />

      <div className="flex flex-1">
        <Sidebar rider_id={rider_id} />

        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Title & Status Indicator */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Rider Dashboard</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your deliveries and earnings</p>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">STATUS:</span>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${isOnline ? 'bg-green-100 text-green-600' : 'bg-pink-100 text-pink-600'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </header>

            {/* Stats Cards Grid (Matches Screenshot 2026-05-13 145846.png) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Statcard value={dashboard.activeDeliveries.toString()} label="ACTIVE DELIVERIES" />
              <Statcard value={dashboard.availableRequests.toString()} label="AVAILABLE REQUESTS" />
              <Statcard value={`৳ ${dashboard.todaysEarnings}`} label="TODAY'S EARNINGS" />
              <Statcard value={dashboard.completedOrders.toString()} label="COMPLETED ORDERS" />
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}


