"use client";

import { use } from "react";

export default function HistoryOrders({ params }: { params: Promise<{ restaurant_id: string }>}) {
  const { restaurant_id } = use(params);
  return (
    <>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Previous Orders</h1>
          <p className="text-slate-500 mt-1">View your restaurant's previous orders</p>
        </div>
      </header>

      

    </>
  );
}