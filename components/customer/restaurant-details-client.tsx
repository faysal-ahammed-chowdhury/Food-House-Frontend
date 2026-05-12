"use client";

import { useState } from "react";
import MenuSection from "./menu-section";
import StickyCart from "./sticky-cart"; // <-- IMPORT IT HERE

export default function RestaurantDetailsClient({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const restaurant = {
    restaurantId: restaurantId,
    name: "Domino's Pizza",
    address: "113 Main St, Food City",
    deliveryFee: 105,
    isOpen: true,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2000&auto=format&fit=crop",
  };

  const [cartItems, setCartItems] = useState<any[]>([]);

  const handleAddToCart = (item: any) => {
    setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);
  };

  const handleUpdateQuantity = (
    itemId: number,
    action: "increase" | "decrease",
  ) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.itemId === itemId) {
            if (action === "increase")
              return { ...item, quantity: item.quantity + 1 };
            if (action === "decrease")
              return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  return (
    <div className="pb-20">
      {/* --- HERO BANNER --- */}
      <div className="relative h-[280px] rounded-3xl overflow-hidden shadow-sm mb-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${restaurant.image})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 p-8 text-white w-full">
          <h1 className="text-4xl font-extrabold mb-3">{restaurant.name}</h1>
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
              <span>Delivery: ৳{restaurant.deliveryFee}</span>
            </div>
            {restaurant.isOpen && (
              <span className="bg-emerald-100 text-emerald-700 font-extrabold px-3 py-1 rounded-full text-xs ml-2">
                Open Now
              </span>
            )}
          </div>
        </div>
      </div>

      {/* --- MAIN SPLIT LAYOUT --- */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN: Menu Items */}
        <div className="flex-1">
          <MenuSection
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        </div>

        {/* RIGHT COLUMN: The Sticky Cart */}
        <div className="w-full lg:w-[380px]">
          <div className="sticky top-6">
            {/* INSERT THE REAL CART HERE! */}
            <StickyCart
              restaurantId={restaurantId}
              deliveryFee={restaurant.deliveryFee}
              cartItems={cartItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
