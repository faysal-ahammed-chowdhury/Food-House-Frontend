"use client";

import Footer from "@/components/restaurants/footer";
import Header from "@/components/restaurants/header";
import Sidebar from "@/components/restaurants/sidebar";
import { use } from "react";


export default function ActiveOrders({ params }: { params: Promise<{ user_id: string }>}){
  const { user_id } = use(params);
  const displayName = "PizzaBurg"; //fetch name from params and decode it for display
    return (
    <>
      <Header user_id={user_id} name={displayName} />
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        
        
        <div className="flex flex-1">
          <aside className="w-64 hidden md:block bg-white border-r border-slate-200">
            <Sidebar user_id={user_id} />
          </aside>
          
          <main className="flex-1 p-8 md:p-12 overflow-y-auto">
              <h1>Active Orders</h1>
          </main>
        </div>
        
        <Footer />
      </div>
    </>
  );
}