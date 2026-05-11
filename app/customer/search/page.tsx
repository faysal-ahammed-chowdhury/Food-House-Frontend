import Navbar from "@/components/customer/navbar";

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
          <div className="relative w-[400px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search restaurants or items..."
              defaultValue={query}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-700 bg-white shadow-sm"
            />
          </div>
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
