import SearchInput from "@/components/customer/search-input";
import Link from "next/link";

export default function RestaurantsClient({ restaurants }: { restaurants: any[] }) {
  
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
        <SearchInput variant="restaurants" />
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {restaurants?.map((restaurant) => (
          <Link
            href={`/customer/restaurants/${restaurant.restaurantId}`}
            key={restaurant.restaurantId}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-shadow group hover:shadow-md cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105`}
                style={{ backgroundImage: `url(${restaurant.image})` }}
              ></div>

              {!restaurant.isOpen && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-red-600 text-white font-bold px-6 py-2 rounded-full uppercase tracking-wider text-sm shadow-lg">
                    Closed
                  </span>
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {restaurant.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-1">{restaurant.tags}</p>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <span className="bg-slate-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                    Delivery
                  </span>
                  <span>৳{restaurant.currentDeliveryFee}</span>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium">
                   {restaurant.isOpen ? (
                     <span className="text-emerald-500 font-bold flex items-center gap-1">
                       <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                       Open
                     </span>
                   ) : (
                     <span className="text-red-500 font-bold flex items-center gap-1">
                       <span className="w-2 h-2 rounded-full bg-red-500"></span>
                       Closed
                     </span>
                   )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}