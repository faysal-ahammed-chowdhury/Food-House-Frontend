"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { getRestaurantCart, clearRestaurantCart } from "./cart-manager";

export default function CheckoutClient({
  restaurantId,
  customer, 
}: {
  restaurantId: string;
  customer: any;
}) {
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK" | "BKASH">("COD");
  const [voucherCode, setVoucherCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [cartData, setCartData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. LOAD: Get only this specific restaurant's data
  useEffect(() => {
    if (restaurantId) {
      const cart = getRestaurantCart(restaurantId as string);
      if (cart) {
        setCartData(cart);
      }
    }
    setIsLoaded(true);
  }, [restaurantId]);

  // 2. The actual API call to place the order
  const handlePlaceOrder = async () => {
    if (!cartData || !cartData.items || cartData.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsProcessing(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      

      const payload = {
        restaurantName: cartData.restaurantName,
        paymentMethod: paymentMethod, 
        items: cartData.items.map((item: any) => ({
          itemId: item.itemId,
          foodName: item.itemName, 
          price: item.itemPrice,   
          quantity: item.quantity,
        })),
      };

      // Send the POST request
      await axios.post(`${API_URL}/customers/orders`, payload, {
        withCredentials: true
      });

      // 👇 Look how clean this is now! The engine does all the work.
      clearRestaurantCart(restaurantId as string);
      
      setIsProcessing(false);
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to place order:", error);
      setIsProcessing(false);
      alert("Something went wrong trying to place your order. Please try again.");
    }
  };

  if (!isLoaded) return null;

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center flex flex-col items-center justify-center max-w-2xl mx-auto mt-10">
        <div className="bg-green-50 p-6 rounded-full mb-6">
          <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-[2.5rem] font-extrabold text-[#1a202c] mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          Your delicious food from <strong>{cartData?.restaurantName}</strong> is being prepared and will be with you shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/customer/orders">
            <button className="w-full bg-[#f0146b] hover:bg-pink-600 transition-colors text-white font-bold py-3 px-8 rounded-xl shadow-sm">
              Track Order
            </button>
          </Link>
          <Link href="/customer/restaurants">
            <button className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-colors font-bold py-3 px-8 rounded-xl shadow-sm">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!cartData) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/customer/restaurants" className="text-[#f0146b] font-bold">Return to Restaurants</Link>
      </div>
    );
  }

  const customerName = customer?.user?.name || customer?.name || "Customer";
  const customerAddress = customer?.address || "Please update your address in profile";
  const customerPhone = customer?.phone || "No phone provided";

  return (
    <>
      <div className="mb-8">
        <h1 className="text-[2.5rem] font-extrabold text-[#1a202c] mb-1">
          Checkout
        </h1>
        <p className="text-gray-500 text-lg">
          Review your order from {cartData.restaurantName}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* --- LEFT COLUMN --- */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Delivery Address Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-[#1a202c] mb-6">
              Delivery Address
            </h2>
            <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-slate-50/50">
              <svg className="w-6 h-6 text-[#f0146b] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <div>
                <h3 className="font-extrabold text-[#1a202c] text-lg">
                  {customerName}
                </h3>
                <p className="text-gray-500 mt-1">{customerAddress}</p>
                <p className="text-gray-500">{customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-[#1a202c] mb-6">
              Payment Method
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => setPaymentMethod("COD")} className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${paymentMethod === "COD" ? "border-[#f0146b] bg-pink-50 text-[#f0146b]" : "border-gray-100 hover:border-gray-200 text-gray-500"}`}>
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <span className="font-bold text-sm">Cash</span>
              </button>
              <button onClick={() => setPaymentMethod("BANK")} className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${paymentMethod === "BANK" ? "border-[#f0146b] bg-pink-50 text-[#f0146b]" : "border-gray-100 hover:border-gray-200 text-gray-500"}`}>
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                <span className="font-bold text-sm">Card</span>
              </button>
              <button onClick={() => setPaymentMethod("BKASH")} className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${paymentMethod === "BKASH" ? "border-[#f0146b] bg-pink-50 text-[#f0146b]" : "border-gray-100 hover:border-gray-200 text-gray-500"}`}>
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                <span className="font-bold text-sm">bKash</span>
              </button>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-[#1a202c] mb-6">
              Order Summary
            </h2>
            <div className="flex flex-col gap-4">
              {cartData.items.map((item: any) => (
                <div key={item.itemId} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="bg-slate-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                      {item.quantity}x
                    </span>
                    <span className="text-gray-700 font-medium">
                      {item.itemName}
                    </span>
                  </div>
                  <span className="font-extrabold text-[#1a202c]">
                    ৳{item.itemPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6">
          
          {/* Voucher Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[#f0146b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
              <h2 className="text-lg font-bold text-[#1a202c]">Voucher</h2>
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter code" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#f0146b]" />
              <button className="bg-[#f0146b] hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">Apply</button>
            </div>
          </div>

          {/* Totals Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
            <div className="flex flex-col gap-4 text-gray-500 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-extrabold text-[#1a202c]">৳{cartData.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-extrabold text-[#1a202c]">৳{cartData.deliveryFee}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-extrabold text-[#1a202c]">Total</span>
                <span className="text-2xl font-extrabold text-[#f0146b]">৳{cartData.total}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className={`w-full transition-colors font-bold py-4 rounded-xl text-lg shadow-sm flex justify-center items-center gap-2 
                ${isProcessing ? "bg-pink-300 cursor-not-allowed text-white" : "bg-[#f0146b] hover:bg-pink-600 text-white"}`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}