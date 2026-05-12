"use client";

import Header from "@/components/riders/header";
import Sidebar from "@/components/riders/sidebar";
import Footer from "@/components/riders/footer";
import { ShoppingBag, MapPin, Phone, ChevronRight } from "lucide-react";
import { use, useState } from "react";

// ১. ডেলিভারি আইটেমের জন্য টাইপ ডিফাইন করা
interface ActiveDelivery {
  id: string;
  store: string;
  customer: string;
  address: string;
  status: string;
}

// ২. টাইপসহ ডামি ডাটা (খালি থাকলেও এখন এরর দিবে না)
const DUMMY_ACTIVE_DELIVERIES: ActiveDelivery[] = [
  // টেস্ট করার জন্য নিচের লাইনটি আনকমেন্ট করতে পারেন
  // { id: "ORD-7721", store: "Burger King", customer: "Ariful Islam", address: "House 12, Road 5, Dhanmondi", status: "Picked Up" },
];

export default function ActiveDeliveries({ params }: { params: Promise<{ rider_id: string }> }) {
  const { rider_id } = use(params);
  
  // ৩. স্টেট-এ টাইপ সেট করা
  const [deliveries, setDeliveries] = useState<ActiveDelivery[]>(DUMMY_ACTIVE_DELIVERIES);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header rider_id={rider_id} />

      <div className="flex flex-1">
        <Sidebar rider_id={rider_id} />

        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            
            <header className="mb-10">
              <h1 className="text-3xl font-extrabold text-slate-800">Active Deliveries</h1>
              <p className="text-gray-500 font-medium mt-1">Orders you are currently delivering</p>
            </header>

            {deliveries.length === 0 ? (
              /* --- EMPTY STATE --- */
              <div className="bg-white border border-slate-200 rounded-[2.5rem] min-h-[450px] flex items-center justify-center p-8 shadow-sm">
                <div className="text-center">
                  <div className="bg-slate-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={48} className="text-slate-300" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">No active deliveries</h2>
                  <p className="text-slate-500 font-medium">Accept a request to get started.</p>
                </div>
              </div>
            ) : (
              /* --- ACTIVE LIST STATE --- */
              <div className="grid gap-6">
                {deliveries.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-pink-200 transition-all">
                    <div className="flex items-center gap-6 w-full">
                      <div className="bg-pink-50 p-5 rounded-2xl text-pink-500 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={32} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-slate-800">{item.store}</h3>
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest">
                            {item.status}
                          </span>
                        </div>
                        <p className="text-slate-500 font-medium flex items-center gap-1 text-sm">
                          <MapPin size={14} className="text-slate-400" /> {item.address}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl transition-colors">
                        <Phone size={20} />
                      </button>
                      <button className="flex-1 md:flex-none bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-pink-100 flex items-center justify-center gap-2 transition-all active:scale-95">
                        View Details <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}