"use client";

import Footer from "@/components/restaurants/footer";
import Header from "@/components/restaurants/header";
import Sidebar from "@/components/restaurants/sidebar";
import axios from "axios";
import { use, useEffect, useState } from "react";


export default function Dashboard({ params }: { params: Promise<{ restaurant_id: string }>}){
  const { restaurant_id } = use(params);
  return (
    <>
    <div className="bg-white">
      <Header restaurant_id={restaurant_id}/>
    
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        
        
        <div className="flex flex-1">
          <aside className="w-64 hidden md:block bg-white border-r border-slate-200">
            <Sidebar restaurant_id={restaurant_id} />
          </aside>
          
          <main className="flex-1 p-8 md:p-12 overflow-y-auto">
              <h1>  </h1>
          </main>
        </div>
        
        <Footer />
      </div>
    </div>
    </>
  );
}