"use client";

import SearchInput from "@/components/customer/search-input";

export default function RestaurantsClient() {
  const restaurants = [
    {
      id: 1,
      name: "Burger Joint",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop",
      rating: "4.8",
      time: "20-30 min",
      tags: "Burgers • American • Fast Food",
    },
    {
      id: 2,
      name: "Pizza Paradise",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop",
      rating: "4.5",
      time: "30-45 min",
      tags: "Pizza • Italian • Comfort",
    },
    {
      id: 3,
      name: "Sushi Zen",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop",
      rating: "4.9",
      time: "25-40 min",
      tags: "Sushi • Japanese • Seafood",
    },
    {
      id: 4,
      name: "Sweet Tooth Desserts",
      image:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=500&auto=format&fit=crop",
      rating: "4.7",
      time: "15-25 min",
      tags: "Desserts • Bakery • Sweets",
    },
    {
      id: 5,
      name: "Taco Fiesta",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop",
      rating: "4.6",
      time: "20-35 min",
      tags: "Mexican • Tacos • Spicy",
    },
    {
      id: 6,
      name: "Green Bowl Salads",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop",
      rating: "4.4",
      time: "15-30 min",
      tags: "Healthy • Vegan • Salads",
    },
  ];

  return (
    <>
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-[2.5rem] font-bold text-[#1a202c] mb-1">
            Restaurants
          </h1>
          <p className="text-gray-500 text-lg">
            Find your favorite meals nearby
          </p>
        </div>

        {/* SearchInput stays here because it's part of the main interactive UI */}
        <SearchInput variant="restaurants" />
      </div>

      {/* Section Title */}
      <div className="flex items-center gap-3 mb-6">
        <svg
          className="w-6 h-6 text-[#f0146b]"
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
        <h2 className="text-[1.5rem] font-bold text-[#1a202c]">
          All Restaurants
        </h2>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-3 gap-8">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
          >
            {/* Restaurant Image */}
            <div className="relative h-48 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${restaurant.image})` }}
              ></div>
            </div>

            {/* Restaurant Details */}
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {restaurant.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4">{restaurant.tags}</p>

              {/* Bottom Row: Rating and Time */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  {restaurant.rating}
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  {restaurant.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
