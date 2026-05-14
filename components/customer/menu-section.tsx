"use client";

import Image from "next/image";

export default function MenuSection({
  menuItems,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  isRestaurantOpen = true,
}: {
  menuItems: any[];
  cartItems: any[];
  onAddToCart: (item: any) => void;
  onUpdateQuantity: (itemId: number, action: "increase" | "decrease") => void;
  isRestaurantOpen?: boolean;
}) {
  
  // Group the flat array of items into categories based on the category relation
  const groupedMenu = menuItems.reduce((acc: any, item: any) => {
    const categoryName = item.category?.name || "Uncategorized";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(item);
    return acc;
  }, {});

  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-500">No items available yet.</h3>
        <p className="text-gray-400 mt-2">Please check back later!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {Object.entries(groupedMenu).map(([categoryName, items]: [string, any]) => (
        <div key={categoryName}>
          <h2 className="text-[1.7rem] font-extrabold text-[#1a202c] mb-6">
            {categoryName}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item: any) => {
              const cartItem = cartItems.find((c) => c.itemId === item.itemId);
              const defaultImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop";

              return (
                <div
                  key={item.itemId}
                  className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 transition-shadow ${
                    item.isAvailable === false ? "opacity-60 grayscale" : "hover:shadow-md"
                  }`}
                >
                  <div className="w-[100px] h-[100px] rounded-xl overflow-hidden relative flex-shrink-0">
                    <Image
                      src={item.imageUrl || defaultImage}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <h3 className="font-extrabold text-[#1a202c] mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-2 pr-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      <span className="font-extrabold text-[#f0146b]">
                        ৳{item.price}
                      </span>

                      {item.isAvailable === false ? (
                         <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Unavailable</span>
                      ) : cartItem ? (
                        <div className={`flex items-center gap-3 border border-gray-100 rounded-lg px-2 py-1 ${isRestaurantOpen ? 'bg-slate-50' : 'bg-gray-100 opacity-70'}`}>
                          <button
                            onClick={() => isRestaurantOpen && onUpdateQuantity(item.itemId, "decrease")}
                            disabled={!isRestaurantOpen}
                            className={`w-6 h-6 flex items-center justify-center font-bold ${isRestaurantOpen ? 'text-gray-500 hover:text-[#f0146b]' : 'text-gray-400 cursor-not-allowed'}`}
                          >
                            -
                          </button>
                          <span className="font-extrabold text-sm w-4 text-center text-[#1a202c]">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => isRestaurantOpen && onUpdateQuantity(item.itemId, "increase")}
                            disabled={!isRestaurantOpen}
                            className={`w-6 h-6 flex items-center justify-center font-bold ${isRestaurantOpen ? 'text-[#f0146b] hover:text-pink-700' : 'text-gray-400 cursor-not-allowed'}`}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (!isRestaurantOpen) return;
                            // Map the DB fields perfectly for the Cart!
                            onAddToCart({
                              ...item,
                              itemName: item.name,
                              itemPrice: item.price,
                            });
                          }}
                          disabled={!isRestaurantOpen}
                          className={`text-sm font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                            isRestaurantOpen 
                              ? "bg-[#f0146b] hover:bg-pink-600 text-white" 
                              : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                          }`}
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}