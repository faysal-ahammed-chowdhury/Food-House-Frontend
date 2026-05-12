"use client";
import Link from "next/link";

const TopRestaurants = () => {
  const topRestaurants = [
    {
      restaurantId: 1,
      name: "Burger Joint",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop",
      rating: "4.8",
      time: "20-30 min",
      tags: "Burgers • American • Fast Food",
      currentDeliveryFee: 45,
      isOpen: true,
    },
    {
      restaurantId: 2,
      name: "Pizza Paradise",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop",
      rating: "4.5",
      time: "30-45 min",
      tags: "Pizza • Italian • Comfort",
      currentDeliveryFee: 60,
      isOpen: true,
    },
    {
      restaurantId: 3,
      name: "Sushi Zen",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop",
      rating: "4.9",
      time: "25-40 min",
      tags: "Sushi • Japanese • Seafood",
      currentDeliveryFee: 80,
      isOpen: true,
    },
    {
      restaurantId: 5,
      name: "Taco Fiesta",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop",
      rating: "4.6",
      time: "20-35 min",
      tags: "Mexican • Tacos • Spicy",
      address: "505 Spice Rd, Food City",
      isOpen: true,
      currentDeliveryFee: 50,
    },
  ];

  return (
    <div className="px-8 py-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Top Restaurants
        </h2>

        <Link
          href="/customer/restaurants"
          className="text-pink-500 font-semibold hover:text-pink-600 flex items-center gap-1 transition-colors"
        >
          See all <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topRestaurants.map((restaurant) => (
          <Link
            href={`/customer/restaurants/${restaurant.restaurantId}`}
            key={restaurant.restaurantId}
            className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-shadow group ${
              restaurant.isOpen
                ? "hover:shadow-md cursor-pointer"
                : "opacity-75 cursor-not-allowed"
            }`}
            onClick={(e) => {
              if (!restaurant.isOpen) e.preventDefault();
            }}
          >
            <div className="relative h-48 overflow-hidden">
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-300 ${
                  restaurant.isOpen
                    ? "group-hover:scale-105"
                    : "grayscale blur-sm"
                }`}
                style={{ backgroundImage: `url(${restaurant.image})` }}
              ></div>

              {!restaurant.isOpen && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-red-600 text-white font-extrabold px-6 py-2 rounded-full uppercase tracking-wider text-sm shadow-lg">
                    Closed
                  </span>
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {restaurant.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4">{restaurant.tags}</p>

              {/* Bottom Row: Rating, Delivery Fee, and Time */}
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

                <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="font-bold">
                      ৳{restaurant.currentDeliveryFee}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopRestaurants;
