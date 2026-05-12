"use client";

import Header from "@/components/riders/header";
import Sidebar from "@/components/riders/sidebar";
import Footer from "@/components/riders/footer";
import axios from "axios";
import { 
  Power, 
  ShoppingBag, 
  Bike, 
  CircleDollarSign, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";
import { use, useState, useEffect } from "react";


export default function Dashboard({ params }: { params: Promise<{ rider_id: string }> }) {
  const { rider_id } = use(params);
  const [ dashboard, setDashboard ] = useState({
    activeDeliveries: 0,
    availableRequests: 0,
    todaysEarnings: 0,
    completedOrders: 0,
  });
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    fetchDashboard();},[]);

  async function fetchDashboard() {
    try {
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/rider/riders/${rider_id}/dashboard`;
      const response = await axios.get(RQ_URL);
      if(response.status === 200) {
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
      //console.log("toggling status:", newStatus);
      const res= await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/rider/riders/${rider_id}/status`, 
        {isOnline: newStatus}
      );
      //console.log("Status update response:", res.data);
      setIsOnline(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <Header rider_id={rider_id}
            isOnline={isOnline} 
            toggleStatus={toggleStatus}
   />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar rider_id={rider_id} />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            
            {/* Page Title & Status */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800">Rider Dashboard</h1>
                <p className="text-gray-500 font-medium">Manage your deliveries and earnings</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Status:</span>
                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${isOnline ? 'bg-green-100 text-green-600' : 'bg-pink-100 text-pink-600'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </header>

            {/* Offline/Online Action Banner */}
            {!isOnline && (
              <div className="bg-white border border-pink-100 rounded-3xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm ring-1 ring-pink-50">
                <div className="flex items-center gap-5">
                  <div className="bg-pink-50 p-4 rounded-2xl text-pink-500">
                    <Power size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-xl">You are currently Offline</h3>
                    <p className="text-slate-500">Switch to online to start receiving new delivery requests.</p>
                  </div>
                </div>
                <button 
                  onClick={toggleStatus}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-100 active:scale-95 flex items-center gap-2"
                >
                  Go Online Now <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard 
                icon={<ShoppingBag size={24} className="text-pink-500" />} 
                value="1" 
                label="Active Deliveries" 
              />
              <StatCard 
                icon={<Bike size={24} className="text-emerald-500" />} 
                value="0" 
                label="Available Requests" 
              />
              <StatCard 
                icon={<CircleDollarSign size={24} className="text-pink-500" />} 
                value="৳ 0" 
                label="Today's Earnings" 
              />
              <StatCard 
                icon={<CheckCircle2 size={24} className="text-pink-500" />} 
                value="0" 
                label="Completed Orders" 
              />
            </div>

            {/* Main Sections: Requests & Active Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Available Requests Section */}
              <section>
                <div className="flex justify-between items-center mb-5 px-1">
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Available Requests</h2>
                  <button className="text-pink-500 font-bold text-sm hover:text-pink-700 transition-colors">View All</button>
                </div>
                <div className="bg-white border border-slate-200 rounded-[2rem] h-48 flex flex-col items-center justify-center text-slate-400 font-medium shadow-sm italic">
                  <Bike size={40} className="mb-2 opacity-20 text-slate-900" />
                  No available requests right now
                </div>
              </section>

              {/* Active Deliveries Section */}
              <section>
                <div className="flex justify-between items-center mb-5 px-1">
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Active Deliveries</h2>
                  <button className="text-pink-500 font-bold text-sm hover:text-pink-700 transition-colors">Manage</button>
                </div>
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 flex items-center justify-between shadow-sm group hover:border-pink-200 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="bg-pink-50 p-4 rounded-2xl text-pink-500 group-hover:scale-110 transition-transform">
                      <ShoppingBag size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">Order #ord2</h4>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Rider Assigned</p>
                    </div>
                  </div>
                  <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95">
                    Track
                  </button>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Reusable StatCard Component
function StatCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="mb-6 bg-slate-50 w-fit p-3 rounded-2xl group-hover:bg-pink-50 transition-colors">
        {icon}
      </div>
      <div className="text-4xl font-black text-slate-800 mb-1">{value}</div>
      <div className="text-sm text-slate-500 font-bold uppercase tracking-wide">{label}</div>
    </div>
  );
}