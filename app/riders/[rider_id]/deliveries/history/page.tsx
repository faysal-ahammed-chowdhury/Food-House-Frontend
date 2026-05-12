"use client";

import Header from "@/components/riders/header";
import Sidebar from "@/components/riders/sidebar";
import Footer from "@/components/riders/footer";
import { Search, Calendar, FileText, Eye } from "lucide-react";
import { use, useState } from "react";

// হিস্ট্রির জন্য টাইপ ডেফিনিশন
interface DeliveryHistoryItem {
  orderId: string;
  restaurant: string;
  customer: string;
  subtotal: string;
  earnings: string;
  date: string;
}

export default function DeliveryHistory({ params }: { params: Promise<{ rider_id: string }> }) {
  const { rider_id } = use(params);
  
  // হিস্ট্রি ডেটা (খালি রাখলে স্ক্রিনশটের মতো "No completed deliveries" দেখাবে)
  const [history, setHistory] = useState<DeliveryHistoryItem[]>([]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header rider_id={rider_id} />

      <div className="flex flex-1">
        <Sidebar rider_id={rider_id} />

        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Header with Filters */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800">Delivery History</h1>
                <p className="text-gray-500 font-medium mt-1">Your completed deliveries</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search history..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>
                {/* Date Picker */}
                <div className="relative sm:w-48">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  <input 
                    type="date" 
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 appearance-none transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* History Table Container */}
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm min-h-[400px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Order</th>
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Restaurant</th>
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Subtotal</th>
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Earnings</th>
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-20 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <FileText size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">No completed deliveries yet.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      history.map((item, index) => (
                        <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-700">{item.orderId}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{item.restaurant}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{item.customer}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{item.subtotal}</td>
                          <td className="px-6 py-4 font-bold text-emerald-600">{item.earnings}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{item.date}</td>
                          <td className="px-6 py-4 text-center">
                            <button className="p-2 hover:bg-pink-50 text-pink-500 rounded-lg transition-colors">
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}