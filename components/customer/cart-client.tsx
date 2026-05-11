"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CartClient() {
  // 1. Interactive State
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Double Cheeseburger",
      restaurant: "Burger Joint",
      price: 12.99,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Large French Fries",
      restaurant: "Burger Joint",
      price: 4.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=200&auto=format&fit=crop",
    },
  ]);

  // 2. Quantity Logic
  const handleQuantityControl = (
    id: number,
    action: "increase" | "decrease",
  ) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === id) {
            if (action === "increase")
              return { ...item, quantity: item.quantity + 1 };
            if (action === "decrease")
              return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // Removes item if quantity hits 0
    });
  };

  // 3. Math Calculations
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const deliveryFee = 2.5;
  const total = subtotal + deliveryFee;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-[2rem] font-bold text-[#1a202c] mb-1">Your Cart</h1>
        <p className="text-gray-500">
          Manage your orders from different restaurants
        </p>
      </div>

      {cartItems.length === 0 ? (
        /* --- EMPTY STATE --- */
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="bg-slate-50 p-6 rounded-full mb-4">
            <svg
              className="w-16 h-16 text-gray-200"
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
          </div>
          <h2 className="text-2xl font-extrabold text-[#1a202c] mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8">
            Browse restaurants to add some delicious food!
          </p>
          <Link
            href="/customer/restaurants"
            className="bg-[#f0146b] hover:bg-pink-600 transition-colors text-white font-bold py-3 px-8 rounded-lg"
          >
            Browse Restaurants
          </Link>
        </div>
      ) : (
        /* --- FILLED STATE --- */
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Items */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-6 border-b border-gray-50 last:border-b-0"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{item.restaurant}</p>
                    <p className="font-bold text-[#f0146b] mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 rounded-lg p-2 border border-gray-100">
                    <button
                      onClick={() => handleQuantityControl(item.id, "decrease")}
                      className="w-8 h-8 flex items-center justify-center rounded bg-white text-gray-600 shadow-sm hover:text-[#f0146b] font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityControl(item.id, "increase")}
                      className="w-8 h-8 flex items-center justify-center rounded bg-white text-gray-600 shadow-sm hover:text-[#f0146b] font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Summary */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">
                Order Summary
              </h2>
              <div className="flex flex-col gap-4 text-gray-600 border-b border-gray-100 pb-6 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-gray-900">
                    ${deliveryFee.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-[#f0146b]">
                  ${total.toFixed(2)}
                </span>
              </div>
              <button className="w-full bg-[#f0146b] hover:bg-pink-600 transition-colors text-white font-bold py-4 rounded-xl text-lg shadow-sm">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
