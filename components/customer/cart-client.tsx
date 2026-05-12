"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CartClient() {
  const [cartItems, setCartItems] = useState([
    {
      itemId: 1, // Changed from id
      restaurantId: 101,
      restaurantName: "Star Kabab",
      restaurantAddress: "109 Main St, Food City",
      itemName: "Grilled Salmon", // Changed from name
      itemPrice: 850, // Changed from price
      quantity: 1,
      // Changed from image
      imageUrl:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=200&auto=format&fit=crop",
    },
    {
      itemId: 2,
      restaurantId: 101,
      restaurantName: "Star Kabab",
      restaurantAddress: "109 Main St, Food City",
      itemName: "Beef Steak",
      itemPrice: 1200,
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=200&auto=format&fit=crop",
    },
    {
      itemId: 3,
      restaurantId: 101,
      restaurantName: "Star Kabab",
      restaurantAddress: "109 Main St, Food City",
      itemName: "Pasta Alfredo",
      itemPrice: 450,
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=200&auto=format&fit=crop",
    },
    {
      itemId: 4,
      restaurantId: 101,
      restaurantName: "Star Kabab",
      restaurantAddress: "109 Main St, Food City",
      itemName: "Chicken Biryani",
      itemPrice: 380,
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=200&auto=format&fit=crop",
    },
    {
      itemId: 5,
      restaurantId: 102,
      restaurantName: "Domino's Pizza",
      restaurantAddress: "113 Main St, Food City",
      itemName: "Grilled Salmon",
      itemPrice: 850,
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=200&auto=format&fit=crop",
    },
    {
      itemId: 6,
      restaurantId: 102,
      restaurantName: "Domino's Pizza",
      restaurantAddress: "113 Main St, Food City",
      itemName: "Pasta Alfredo",
      itemPrice: 450,
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=200&auto=format&fit=crop",
    },
    {
      itemId: 7,
      restaurantId: 102,
      restaurantName: "Domino's Pizza",
      restaurantAddress: "113 Main St, Food City",
      itemName: "Vegetable Platter",
      itemPrice: 320,
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop",
    },
    {
      itemId: 8,
      restaurantId: 102,
      restaurantName: "Domino's Pizza",
      restaurantAddress: "113 Main St, Food City",
      itemName: "Chicken Biryani",
      itemPrice: 380,
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=200&auto=format&fit=crop",
    },
  ]);

  const [vouchers, setVouchers] = useState<Record<number, string>>({});

  const handleQuantityControl = (
    itemId: number,
    action: "increase" | "decrease",
  ) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.itemId === itemId) {
            if (action === "increase")
              return { ...item, quantity: item.quantity + 1 };
            if (action === "decrease")
              return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.itemId !== itemId),
    );
  };

  const groupedCart = cartItems.reduce((acc: any, item) => {
    if (!acc[item.restaurantId]) {
      acc[item.restaurantId] = {
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
        restaurantAddress: item.restaurantAddress,
        items: [],
        subtotal: 0,
        totalItems: 0,
      };
    }
    acc[item.restaurantId].items.push(item);
    acc[item.restaurantId].subtotal += item.itemPrice * item.quantity;
    acc[item.restaurantId].totalItems += item.quantity;
    return acc;
  }, {});

  const restaurants = Object.values(groupedCart);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-[2.5rem] font-bold text-[#1a202c] mb-1">
          Your Cart
        </h1>
        <p className="text-gray-500 text-lg">
          Manage your orders from different restaurants
        </p>
      </div>

      {restaurants.length === 0 ? (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {restaurants.map((group: any) => (
            <div
              key={group.restaurantId}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col h-full"
            >
              {/* Restaurant Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-[1.7rem] font-bold text-[#1a202c] mb-1">
                    {group.restaurantName}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {group.restaurantAddress}
                  </p>
                </div>
                <span className="bg-[#e8f3fe] text-[#3498db] text-xs font-bold px-3 py-1.5 rounded-full">
                  {group.totalItems} Items
                </span>
              </div>

              {/* Items List */}
              <div className="flex-1 flex flex-col gap-6 mb-6">
                {group.items.map((item: any) => (
                  // Updated key to itemId
                  <div key={item.itemId} className="flex gap-4 items-center">
                    <div className="w-[70px] h-[70px] rounded-xl overflow-hidden relative flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.itemName}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-extrabold text-[#1a202c] mb-2">
                        {item.itemName}
                      </h3>
                      <div className="inline-flex items-center gap-3 bg-pink-50 text-[#f0146b] rounded-full px-3 py-1 font-bold text-sm">
                        <button
                          onClick={() =>
                            handleQuantityControl(item.itemId, "decrease")
                          }
                          className="hover:text-pink-700"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityControl(item.itemId, "increase")
                          }
                          className="hover:text-pink-700"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex flex-col justify-between items-end h-[70px]">
                      <button
                        onClick={() => handleRemoveItem(item.itemId)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                      <span className="font-extrabold text-[1.1rem] text-[#1a202c]">
                        ৳{item.itemPrice * item.quantity}{" "}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer: Voucher, Subtotal, Checkout */}
              <div className="mt-auto border-t border-gray-100 pt-6">
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="Have a voucher code?"
                    className="flex-1 bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#f0146b] text-gray-700"
                  />
                  <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">
                    Apply
                  </button>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-bold text-lg">
                    Subtotal
                  </span>
                  <span className="text-[1.5rem] font-extrabold text-[#1a202c]">
                    ৳{group.subtotal}
                  </span>
                </div>

                <Link
                  href={`/customer/checkout?restaurantId=${group.restaurantId}`}
                >
                  <button className="w-full bg-[#f0146b] hover:bg-pink-600 transition-colors text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg shadow-sm">
                    Checkout from this Restaurant
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
