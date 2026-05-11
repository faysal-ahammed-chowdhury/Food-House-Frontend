"use client";

import { use } from "react";

export default function ActiveOrders({ params }: { params: Promise<{ restaurant_id: string }>}) {
  const { restaurant_id } = use(params);
  const displayName = "PizzaBurg";
  return (
    <>

      <h1>Active Orders</h1>

    </>
  );
}