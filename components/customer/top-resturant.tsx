import Link from "next/link";

const TopRestaurants = ({ restaurants }: { restaurants: any[] }) => {
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
        {restaurants?.map((restaurant) => (
          <Link
            href={`/customer/restaurants/${restaurant.restaurantId}`}
            key={restaurant.restaurantId}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-shadow group hover:shadow-md cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${restaurant.image})` }}
              ></div>
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
                   <span className="text-emerald-500 font-bold flex items-center gap-1">
                     <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                     Open
                   </span>
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