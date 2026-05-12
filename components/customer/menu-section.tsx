"use client";

import Image from "next/image";

// Defining the types based on your DB schema
type MenuItem = {
  itemId: number;
  itemName: string;
  itemDescription: string;
  itemPrice: number;
  imageUrl: string;
};

type MenuCategory = {
  categoryId: number;
  categoryName: string;
  items: MenuItem[];
};

export default function MenuSection({
  cartItems,
  onAddToCart,
  onUpdateQuantity,
}: {
  cartItems: any[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: number, action: "increase" | "decrease") => void;
}) {
  // Dummy Data matching screenshot and grouped by Category
  const menuData: MenuCategory[] = [
    {
      categoryId: 1,
      categoryName: "Appetizers",
      items: [
        {
          itemId: 101,
          itemName: "Spring Rolls",
          itemDescription: "Delicious Spring Rolls prepared by expert chefs.",
          itemPrice: 180,
          imageUrl:
            "https://images.unsplash.com/photo-1544025162-811114215b22?q=80&w=200&auto=format&fit=crop",
        },
        {
          itemId: 102,
          itemName: "Chicken Wings",
          itemDescription: "Delicious Chicken Wings prepared by expert chefs.",
          itemPrice: 250,
          imageUrl:
            "https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?q=80&w=200&auto=format&fit=crop",
        },
        {
          itemId: 103,
          itemName: "French Fries",
          itemDescription: "Delicious French Fries prepared by expert chefs.",
          itemPrice: 120,
          imageUrl:
            "https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=200&auto=format&fit=crop",
        },
        {
          itemId: 104,
          itemName: "Garlic Bread",
          itemDescription: "Delicious Garlic Bread prepared by expert chefs.",
          itemPrice: 150,
          imageUrl:
            "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=200&auto=format&fit=crop",
        },
        {
          itemId: 105,
          itemName: "Nachos",
          itemDescription: "Delicious Nachos prepared by expert chefs.",
          itemPrice: 220,
          imageUrl:
            "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=200&auto=format&fit=crop",
        },
        {
          itemId: 106,
          itemName: "Soup of the Day",
          itemDescription:
            "Delicious Soup of the Day prepared by expert chefs.",
          itemPrice: 160,
          imageUrl:
            "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=200&auto=format&fit=crop",
        },
      ],
    },
    {
      categoryId: 2,
      categoryName: "Main Course",
      items: [
        {
          itemId: 201,
          itemName: "Grilled Salmon",
          itemDescription: "Delicious Grilled Salmon prepared by expert chefs.",
          itemPrice: 850,
          imageUrl:
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=200&auto=format&fit=crop",
        },
        {
          itemId: 202,
          itemName: "Beef Steak",
          itemDescription: "Delicious Beef Steak prepared by expert chefs.",
          itemPrice: 1200,
          imageUrl:
            "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=200&auto=format&fit=crop",
        },
        {
          itemId: 203,
          itemName: "Pasta Alfredo",
          itemDescription: "Delicious Pasta Alfredo prepared by expert chefs.",
          itemPrice: 450,
          imageUrl:
            "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=200&auto=format&fit=crop",
        },
        {
          itemId: 204,
          itemName: "Chicken Biryani",
          itemDescription:
            "Delicious Chicken Biryani prepared by expert chefs.",
          itemPrice: 380,
          imageUrl:
            "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=200&auto=format&fit=crop",
        },
      ],
    },
    {
      categoryId: 3,
      categoryName: "Sub Course",
      items: [
        {
          itemId: 201,
          itemName: "Grilled Salmon",
          itemDescription: "Delicious Grilled Salmon prepared by expert chefs.",
          itemPrice: 850,
          imageUrl:
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=200&auto=format&fit=crop",
        },
        {
          itemId: 202,
          itemName: "Beef Steak",
          itemDescription: "Delicious Beef Steak prepared by expert chefs.",
          itemPrice: 1200,
          imageUrl:
            "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=200&auto=format&fit=crop",
        },
        {
          itemId: 203,
          itemName: "Pasta Alfredo",
          itemDescription: "Delicious Pasta Alfredo prepared by expert chefs.",
          itemPrice: 450,
          imageUrl:
            "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=200&auto=format&fit=crop",
        },
        {
          itemId: 204,
          itemName: "Chicken Biryani",
          itemDescription:
            "Delicious Chicken Biryani prepared by expert chefs.",
          itemPrice: 380,
          imageUrl:
            "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=200&auto=format&fit=crop",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      {menuData.map((category) => (
        <div key={category.categoryId}>
          {/* Category Heading */}
          <h2 className="text-[1.7rem] font-extrabold text-[#1a202c] mb-6">
            {category.categoryName}
          </h2>

          {/* Grid of Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.items.map((item) => {
              // Check if this item is already in the cart
              const cartItem = cartItems.find((c) => c.itemId === item.itemId);

              return (
                <div
                  key={item.itemId}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow"
                >
                  {/* Item Image */}
                  <div className="w-[100px] h-[100px] rounded-xl overflow-hidden relative flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.itemName}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <h3 className="font-extrabold text-[#1a202c] mb-1">
                        {item.itemName}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-2 pr-2">
                        {item.itemDescription}
                      </p>
                    </div>

                    {/* Bottom Row: Price & Button */}
                    <div className="flex justify-between items-end mt-2">
                      <span className="font-extrabold text-[#f0146b]">
                        ৳{item.itemPrice}
                      </span>

                      {/* CONDITIONAL RENDER: Add Button OR Quantity Controls */}
                      {cartItem ? (
                        <div className="flex items-center gap-3 bg-slate-50 border border-gray-100 rounded-lg px-2 py-1">
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.itemId, "decrease")
                            }
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-[#f0146b] font-bold"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-sm w-4 text-center text-[#1a202c]">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.itemId, "increase")
                            }
                            className="w-6 h-6 flex items-center justify-center text-[#f0146b] hover:text-pink-700 font-bold"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddToCart(item)}
                          className="bg-[#f0146b] hover:bg-pink-600 transition-colors text-white text-sm font-bold px-4 py-1.5 rounded-lg flex items-center gap-1"
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
