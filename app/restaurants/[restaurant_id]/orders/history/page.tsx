"use client";

import { use } from "react";

export default function HistoryOrders({ params }: { params: Promise<{ restaurant_id: string }>}) {
  const { restaurant_id } = use(params);
  return (
    <>

      <h1>History Orders</h1>

    </>
  );
}