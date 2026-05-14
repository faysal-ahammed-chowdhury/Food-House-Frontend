"use client";

import Header from "@/components/riders/header";
import Sidebar from "@/components/riders/sidebar";
import Footer from "@/components/riders/footer";
import { Power, Search, ShoppingBag } from "lucide-react";
import { use, useEffect, useState } from "react";
import axios from "axios";

export default function DeliveryRequests({ params }: { params: Promise<{ rider_id: string }> }) {
  const { rider_id } = use(params);
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

 
  return (
    
     
      

      <div className="flex flex-1">
        
       

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Title & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800">Delivery Requests</h1>
                <p className="text-gray-500 font-medium mt-1">Available orders waiting for a rider</p>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                  <ShoppingBag size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search area..." 
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-pink-100 focus:border-pink-300 outline-none transition-all shadow-sm italic"
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-pink-50/50 border border-pink-100 rounded-[2.5rem] min-h-[500px] flex items-center justify-center p-8">
              {!isOnline ? (
                /* Offline State */
                <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
                  {/* <div className="flex justify-center mb-6">
                    <div className="bg-white p-8 rounded-full shadow-xl shadow-pink-100">
                      <Power size={44} strokeWidth={1.5} className="text-pink-400" />
                    </div>
                  </div> */}
                  <h2 className="text-3xl font-black text-slate-800 mb-3">You are Offline</h2>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8">
                    Go online to see and accept delivery requests.
                  </p>
                  
                </div>
              ) : (
                /* Online State (Placeholder for orders) */
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-slate-100">
                    <Search size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-700">Looking for requests...</h3>
                    <p className="text-slate-400 mt-2 font-medium">Orders from your nearby areas will appear here.</p>
                    
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

     
   
  );
}