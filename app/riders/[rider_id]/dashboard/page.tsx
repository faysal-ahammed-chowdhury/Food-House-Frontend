"use client";

import Statcard from "@/components/riders/statcard";
import axios from "axios";
import { use, useEffect, useState } from "react";

export default function RiderDashboardPage({params}: {params: Promise<{rider_id: string}>}) {
  const { rider_id } = use(params);
  const [dashboard, setDashboard] = useState({
    activeDeliveries: 0,
    availableRequests: 0,
    todaysEarnings: 0,
    completedOrders: 0,
  });
  
   const [isOnline, setIsOnline] = useState(false);

   async function fetchStatus() {
  try {

    console.log("Fetching status for rider ID:", rider_id);
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/rider/riders/${rider_id}/status`
    );
    if (response.status === 200) {
      setIsOnline(response.data.data.isOnline);
    }
  } catch (error) {
    console.error("Error fetching rider status:", error);
  }
}

useEffect(() => {
  fetchStatus();
}, []);

  useEffect(() => {
    fetchDashboard();
  }, [rider_id]);

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
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  } 

  return(
    <>

    <div className="flex flex-col min-h-screen bg-slate-50">
      

      <div className="flex flex-1">
       

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
                <span
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isOnline ? "bg-green-100 text-green-600" : "bg-pink-100 text-pink-600"
              }`}>
              {isOnline ? "Online" : "Offline"}
            </span>
              </div>
            </header>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Statcard value={dashboard.activeDeliveries.toString()} label="ACTIVE DELIVERIES" />
              <Statcard value={
                isOnline ? dashboard.availableRequests.toString() : "0"
              } label="AVAILABLE REQUESTS" />
              <Statcard value={`৳ ${dashboard.todaysEarnings}`} label="TODAY'S EARNINGS" />
              <Statcard value={dashboard.completedOrders.toString()} label="COMPLETED ORDERS" />
            </div>

          </div>
        </main>
      </div>

     
    </div>
    
    
    </>
  )

}