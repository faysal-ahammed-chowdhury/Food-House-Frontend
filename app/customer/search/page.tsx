import Navbar from "@/components/customer/navbar";
import SearchInput from "@/components/customer/search-input";

export const metadata = {
  title: "Search | FoodHouse",
};

export default async function SearchPage({ searchParams }: any) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.query || "";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-gray-100">
        <main className="max-w-6xl xl:mx-auto w-full">
          <Navbar />
        </main>
      </div>

      <main className="max-w-6xl xl:mx-auto w-full px-8 py-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-[2.5rem] font-bold text-[#1a202c] mb-1">
              Search Results
            </h1>
            <p className="text-gray-500 text-lg">Result for "{query}"</p>
          </div>

          {/* Top Search Input */}
          <SearchInput initialQuery={query} />
        </div>

        {/* Related Items Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <svg
              className="w-7 h-7 text-[#f0146b]"
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
            <h2 className="text-[1.7rem] font-bold text-[#1a202c]">
              Related Items
            </h2>
            <span className="bg-blue-50 text-blue-500 text-xs font-bold px-3 py-1 rounded-full">
              0
            </span>
          </div>

          {/* Empty State Card */}
          <div className="bg-white rounded-2xl py-16 text-center border border-gray-200 shadow-sm">
            <p className="text-gray-400 font-medium text-lg">
              No items found matching your search.
            </p>
          </div>
        </div>

        {/* Restaurants Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <svg
              className="w-7 h-7 text-[#f0146b]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"
              ></path>
            </svg>
            <h2 className="text-[1.7rem] font-bold text-[#1a202c]">
              Restaurants
            </h2>
            <span className="bg-blue-50 text-blue-500 text-xs font-bold px-3 py-1 rounded-full">
              0
            </span>
          </div>

          {/* Empty State Card */}
          <div className="bg-white rounded-2xl py-16 text-center border border-gray-200 shadow-sm">
            <p className="text-gray-400 font-medium text-lg">
              No restaurants found matching your search.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
