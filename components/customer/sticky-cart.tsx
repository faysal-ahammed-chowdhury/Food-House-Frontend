"use client";

import { useRouter } from "next/navigation"; 

export default function StickyCart({
  restaurantId,
  restaurantName, 
  deliveryFee,
  cartItems,
}: {
  restaurantId: string;
  restaurantName?: string;
  deliveryFee: number;
  cartItems: any[];
}) {
  const router = useRouter();
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.itemPrice * item.quantity,
    0,
  );

  const total = subtotal + deliveryFee;

  const handleProceedToCheckout = () => {
    router.push(`/customer/checkout?restaurantId=${restaurantId}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
        <svg
          className="w-5 h-5 text-[#f0146b]"
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
        <h2 className="text-xl font-extrabold text-[#1a202c]">Your Cart</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>Your cart is empty.</p>
          <p className="text-sm">Add some items from the menu!</p>
        </div>
      ) : (
        <>
          {/* Cart Items List */}
          <div className="flex flex-col gap-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {cartItems.map((item) => (
              <div key={item.itemId} className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-[#1a202c] text-sm">{item.itemName}</h4>
                  <p className="text-gray-400 text-xs mt-0.5"> ৳{item.itemPrice} x {item.quantity} </p>
                </div>
                <span className="font-extrabold text-[#1a202c] text-sm">৳{item.itemPrice * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Cart Footer / Totals */}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-3 text-sm text-gray-500 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-[#1a202c]">৳{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold text-[#1a202c]">৳{deliveryFee}</span>
            </div>
            <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-50">
              <span className="text-lg font-extrabold text-[#1a202c]">Total</span>
              <span className="text-xl font-extrabold text-[#1a202c]">৳{total}</span>
            </div>
          </div>

          <button onClick={handleProceedToCheckout} className="w-full bg-[#f0146b] hover:bg-pink-600 transition-colors text-white font-bold py-3.5 rounded-xl shadow-sm text-sm">
            Go to Checkout
          </button>
        </>
      )}
    </div>
  );
}