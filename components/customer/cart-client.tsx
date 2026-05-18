"use client";

import AuthContext from "@/contexts/auth/auth-context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { getGlobalCart, saveRestaurantCart } from "./cart-manager";

export default function CartClient() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const authContext = useContext(AuthContext);
  const userId = authContext?.user?.userId;

  // 1. LOAD CART DATA
  useEffect(() => {
    if (authContext?.isLoadingUser) return;
    if (!authContext?.user) {
      router.push("/auth/login");
      return;
    }
    const globalCart = getGlobalCart(userId);
    setRestaurants(Object.values(globalCart));
    setIsLoaded(true);
  }, []);

  // 2. UPDATE CART DATA (Quantity Changes)
  const handleQuantityControl = (
    restaurantId: string,
    itemId: number,
    action: "increase" | "decrease",
  ) => {
    const globalCart = getGlobalCart(userId);
    const targetCart = globalCart[restaurantId];
    if (!targetCart) return;

    const updatedItems = targetCart.items
      .map((item: any) => {
        if (item.itemId === itemId) {
          return {
            ...item,
            quantity:
              action === "increase" ? item.quantity + 1 : item.quantity - 1,
          };
        }
        return item;
      })
      .filter((item: any) => item.quantity > 0);

    const newSubtotal = updatedItems.reduce(
      (acc: number, i: any) => acc + i.itemPrice * i.quantity,
      0,
    );
    const updatedCart = {
      ...targetCart,
      items: updatedItems,
      subtotal: newSubtotal,
      total: newSubtotal + targetCart.deliveryFee,
    };

    saveRestaurantCart(restaurantId, updatedCart, userId);
    setRestaurants(Object.values(getGlobalCart(userId)));
  };

  // 3. Remove Items
  const handleRemoveItem = (restaurantId: string, itemId: number) => {
    const globalCart = getGlobalCart(userId);
    const targetCart = globalCart[restaurantId];
    if (!targetCart) return;

    const updatedItems = targetCart.items.filter(
      (item: any) => item.itemId !== itemId,
    );
    const newSubtotal = updatedItems.reduce(
      (acc: number, i: any) => acc + i.itemPrice * i.quantity,
      0,
    );
    const updatedCart = {
      ...targetCart,
      items: updatedItems,
      subtotal: newSubtotal,
      total: newSubtotal + targetCart.deliveryFee,
    };

    saveRestaurantCart(restaurantId, updatedCart, userId);
    setRestaurants(Object.values(getGlobalCart(userId)));
  };

  if (!isLoaded) return null;

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
          <h2 className="text-2xl font-extrabold text-[#1a202c] mb-2">
            Your cart is empty
          </h2>
          <Link
            href="/customer/restaurants"
            className="bg-[#f0146b] text-white font-bold py-3 px-8 rounded-lg mt-4"
          >
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {restaurants.map((group) => (
            <div
              key={group.restaurantId}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-[1.7rem] font-bold text-[#1a202c] mb-1">
                    {group.restaurantName}
                  </h2>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-6 mb-6">
                {group.items.map((item: any) => (
                  <div key={item.itemId} className="flex gap-4 items-center">
                    <div className="w-[70px] h-[70px] rounded-xl overflow-hidden relative flex-shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/customers/images/${item.imageUrl}`}
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
                      <div className="inline-flex items-center gap-4 bg-pink-50 text-[#f0146b] rounded-full px-3 py-1.5 font-bold text-md">
                        <button
                          onClick={() =>
                            handleQuantityControl(
                              group.restaurantId,
                              item.itemId,
                              "decrease",
                            )
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityControl(
                              group.restaurantId,
                              item.itemId,
                              "increase",
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between items-end h-[70px]">
                      <button
                        onClick={() =>
                          handleRemoveItem(group.restaurantId, item.itemId)
                        }
                        className="text-gray-300 hover:text-red-500"
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
                      <span className="font-extrabold text-[#1a202c]">
                        ৳{item.itemPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto border-t border-gray-100 pt-6">
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
                  <button className="w-full bg-[#f0146b] text-white font-bold py-4 rounded-xl text-lg shadow-sm">
                    Checkout from this Restaurant
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
