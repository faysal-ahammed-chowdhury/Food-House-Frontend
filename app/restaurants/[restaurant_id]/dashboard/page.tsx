"use client";


import { CheckCircle, CircleDollarSign, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { use, useEffect, useState } from "react";


export default function Dashboard({ params }: { params: Promise<{ restaurant_id: string }>}){
  const { restaurant_id } = use(params);
const [statsData, setStatsData] = useState({
    activeOrders: 0,
    completedOrders: 0,
    netEarnings: 0,
    menuItems: 0
  });
  return (
    <>
      
     <div className="p-8 bg-slate-50 min-h-screen">
      <div className="grid grid-cols-6 gap-6 max-w-6xl mx-auto">
        
        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4 text-pink-500"><ShoppingBag size={24} strokeWidth={2.5} /></div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">{statsData.activeOrders}</h3>
            <p className="text-sm font-medium text-slate-500">Active Orders</p>
          </div>
        </div>

        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4 text-emerald-500"><CheckCircle size={24} strokeWidth={2.5} /></div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">{statsData.completedOrders}</h3>
            <p className="text-sm font-medium text-slate-500">Completed Orders</p>
          </div>
        </div>

        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4 text-pink-500"><CircleDollarSign size={24} strokeWidth={2.5} /></div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">৳{statsData.netEarnings}</h3>
            <p className="text-sm font-medium text-slate-500">Today's Net Earnings</p>
          </div>
        </div>
      </div>
        
        <br></br><br></br><br></br>
      
      <div className="grid grid-cols-6 gap-16 max-w-4xl mx-auto">
        <div className="col-span-3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4 text-pink-500"><UtensilsCrossed size={24} strokeWidth={2.5} /></div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">{statsData.menuItems}</h3>
            <p className="text-sm font-medium text-slate-500">Menu Items</p>
          </div>
        </div>

        <div className="col-span-3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4 text-pink-500"><UtensilsCrossed size={24} strokeWidth={2.5} /></div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">{statsData.menuItems}</h3>
            <p className="text-sm font-medium text-slate-500">Extra Stat Label</p>
          </div>
        </div>
        
      </div>
    </div>

    </>
  );
}