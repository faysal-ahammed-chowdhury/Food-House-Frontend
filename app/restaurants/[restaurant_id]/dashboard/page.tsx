"use client";


import { use, useEffect, useState } from "react";


export default function Dashboard({ params }: { params: Promise<{ restaurant_id: string }>}){
  const { restaurant_id } = use(params);
  return (
    <>
      
      <h1>  </h1>

    </>
  );
}