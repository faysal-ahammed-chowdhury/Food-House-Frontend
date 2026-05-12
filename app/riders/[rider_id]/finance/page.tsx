"use client";

import Header from "@/components/riders/header";
import Sidebar from "@/components/riders/sidebar";
import Footer from "@/components/riders/footer";
import { DollarSign, Wallet, History } from "lucide-react";
import { use, useState } from "react";

// আর্নিং ডেটার জন্য টাইপ
interface FinanceRecord {
  date: string;
  orderId: string;
  payment: string;
  totalAmount: string;
  deliveryFee: string;
}

export default function FinancePage({ params }: { params: Promise<{ rider_id: string }> }) {
  const { rider_id } = use(params);
  
  // ফাইনান্স রেকর্ডস (খালি থাকলে স্ক্রিনশটের মতো "No delivery history found" দেখাবে)
  const [records, setRecords] = useState<FinanceRecord[]>([]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header rider_id={rider_id} />

      <div className="flex flex-1">
        <Sidebar rider_id={rider_id} />

        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-800">Finance</h1>
              <p className="text-gray-500 font-medium mt-1">Manage your delivery fees and earnings</p>
            </header>

            {/* Lifetime Earnings Hero Card (Dark Theme) */}
            <div className="bg-[#0f172a] rounded-[2rem] p-8 md:p-12 mb-10 text-white relative overflow-hidden shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md">
                    <DollarSign size={40} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-light text-slate-400">৳</span>
                      <span className="text-5xl font-black tracking-tight">8,000</span>
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Lifetime Earnings</p>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-slate-400 text-sm font-medium mb-1">Total earned from all deliveries</p>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter italic">Calculated from 0 completed deliveries</p>
                </div>
              </div>
              
              {/* Decorative circles in background */}
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            {/* Recent Deliveries Table */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                  Recent Deliveries & Earnings
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/80">
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Order ID</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Payment</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Amount</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Delivery Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <History size={40} className="text-slate-200 mb-3" />
                            <p className="text-slate-400 font-bold italic">No delivery history found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      records.map((record, index) => (
                        <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-4 text-slate-600 font-medium">{record.date}</td>
                          <td className="px-8 py-4 font-bold text-slate-800">{record.orderId}</td>
                          <td className="px-8 py-4">
                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black uppercase">
                              {record.payment}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-slate-700 font-bold">৳ {record.totalAmount}</td>
                          <td className="px-8 py-4 font-black text-pink-500">৳ {record.deliveryFee}</td>
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