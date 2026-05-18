"use client";

import SearchInput from "@/components/customer/search-input";
import Link from "next/link";
import Image from "next/image";

export default function SearchClient(
  { query, initialResults }: 
  { query: string; initialResults: { restaurants: any[]; items: any[] }; }) {
  const restaurants = initialResults?.restaurants || [];
  const items = initialResults?.items || [];

  return (
    <>
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-[2.5rem] font-bold text-[#1a202c] mb-1">
            Search Results
          </h1>
          <p className="text-gray-500 text-lg">
            {query ? `Result for "${query}"` : "Search for restaurants or items"}
          </p>
        </div>

        {/* Top Search Input */}
        <SearchInput initialQuery={query} />
      </div>

      {/* --- ITEMS SECTION --- */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-7 h-7 text-[#f0146b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <h2 className="text-[1.7rem] font-bold text-[#1a202c]">Related Items</h2>
          <span className="bg-blue-50 text-blue-500 text-xs font-bold px-3 py-1 rounded-full"> {items.length} </span>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl py-16 text-center border border-gray-200 shadow-sm">
            <p className="text-gray-400 font-medium text-lg">No items found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link href={`/customer/restaurants/${item.restaurantId}`} key={item.itemId}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4 flex gap-4 items-center h-full">
                  <div className="w-20 h-20 rounded-xl overflow-hidden relative flex-shrink-0 bg-gray-100">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.itemName} fill unoptimized className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1a202c]">{item.itemName}</h3>
                    <p className="text-[#f0146b] font-extrabold mt-1">৳{item.price}</p>
                  </div>
                  
                  <div className="text-gray-300 pr-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* --- RESTAURANTS SECTION --- */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-7 h-7 text-[#f0146b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
          </svg>
          <h2 className="text-[1.7rem] font-bold text-[#1a202c]">Restaurants</h2>
          <span className="bg-blue-50 text-blue-500 text-xs font-bold px-3 py-1 rounded-full">{restaurants.length}</span>
        </div>

        {restaurants.length === 0 ? (
          <div className="bg-white rounded-2xl py-16 text-center border border-gray-200 shadow-sm">
            <p className="text-gray-400 font-medium text-lg">No restaurants found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Link href={`/customer/restaurants/${restaurant.restaurantId}`} key={restaurant.restaurantId}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-40 bg-gray-200 relative">
                    {restaurant.bannerUrl && (
                      <Image src={restaurant.bannerUrl} alt={restaurant.user?.name} fill unoptimized className="object-cover" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-extrabold text-xl text-[#1a202c] mb-1">
                      {restaurant.user?.name || "Unknown Restaurant"}
                    </h3>
                    <p className="text-gray-500 text-sm">{restaurant.address}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}