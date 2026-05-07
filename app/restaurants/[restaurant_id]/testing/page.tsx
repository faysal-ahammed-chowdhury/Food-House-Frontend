"use client";

import Footer from "@/components/restaurants/footer";
import Header from "@/components/restaurants/header";
import Sidebar from "@/components/restaurants/sidebar";
import { use } from "react";


export default function Testing({ params }: { params: Promise<{ restaurant_id: string }> }){
  const { restaurant_id } = use(params);
  const displayName = "PizzaBurg"; //fetch name from params and decode it for display
    return (
    <>
    <div className="bg-white">
      <Header restaurant_id={restaurant_id} name={displayName} />
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        
        
        <div className="flex flex-1">
          <aside className="w-64 hidden md:block bg-white border-r border-slate-200">
            <Sidebar restaurant_id={restaurant_id} />
          </aside>
                    {/*  */}
<div className="card bg-base-100 w-50 h-80 shadow-sm">
  <figure>
    <img
      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">
      Card Title
      <div className="badge badge-secondary">NEW</div>
    </h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    <div className="card-actions justify-end">
      <div className="badge badge-outline">Fashion</div>
      <div className="badge badge-outline">Products</div>
    </div>
  </div>
</div>
      {/*  */}
          
          <main className="flex-1 p-8 md:p-12 overflow-y-auto">
              <h1>Financials</h1>
          </main>
        </div>
        
        <Footer />
      </div>


      
  </div>
  </>
    
  );
}