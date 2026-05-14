"use client";

import { useState, useEffect } from "react";
// 👇 Import your new engine
import { getRestaurantCart, saveRestaurantCart } from "./cart-manager";
import MenuSection from "./menu-section";
import StickyCart from "./sticky-cart"; 

export default function RestaurantDetailsClient({ restaurant }: { restaurant: any }) {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const restaurantName = restaurant.user?.name || "Unknown Restaurant";
  const deliveryFee = restaurant.currentDeliveryFee || 50;
  const stringRestaurantId = restaurant.restaurantId.toString();

  // 1. LOAD: Ask the engine for this specific restaurant's data
  useEffect(() => {
    const existingCart = getRestaurantCart(stringRestaurantId);
    if (existingCart && existingCart.items) {
      setCartItems(existingCart.items);
    }
    setIsLoaded(true);
  }, [stringRestaurantId]);

  // 2. SAVE: Tell the engine to save whenever items change
  useEffect(() => {
    if (isLoaded) {
      const subtotal = cartItems.reduce((acc, item) => acc + item.itemPrice * item.quantity, 0);
      
      const cartData = {
        restaurantId: stringRestaurantId,
        restaurantName: restaurantName,
        deliveryFee: deliveryFee,
        subtotal: subtotal,
        total: subtotal + deliveryFee,
        items: cartItems,
      };

      // The engine handles all the complex logic now!
      saveRestaurantCart(stringRestaurantId, cartData);
    }
  }, [cartItems, isLoaded, stringRestaurantId, restaurantName, deliveryFee]);

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

  const bannerImage = restaurant.bannerUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2000&auto=format&fit=crop";

  // Prevent UI flashing while loading the cart from memory
  if (!isLoaded) return null;

  return (
    <div className="pb-20">
      {/* --- HERO BANNER --- */}
      <div className="relative h-[280px] rounded-3xl overflow-hidden shadow-sm mb-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 p-8 text-white w-full">
          <h1 className="text-4xl font-extrabold mb-3">{restaurantName}</h1>
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span>Delivery: ৳{deliveryFee}</span>
            </div>
            {restaurant.isOpen ? (
              <span className="bg-emerald-100 text-emerald-700 font-extrabold px-3 py-1 rounded-full text-xs ml-2">
                Open Now
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 font-extrabold px-3 py-1 rounded-full text-xs ml-2">
                Closed
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
            menuItems={restaurant.items || []} 
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            isRestaurantOpen={restaurant.isOpen !== false} 
          />
        </div>

        {/* RIGHT COLUMN: The Sticky Cart */}
        <div className="w-full lg:w-[380px]">
          <div className="sticky top-6">
            <StickyCart
              restaurantId={stringRestaurantId}
              restaurantName={restaurantName}
              deliveryFee={deliveryFee}
              cartItems={cartItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}