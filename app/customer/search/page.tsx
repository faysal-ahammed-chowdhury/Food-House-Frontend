import Navbar from "@/components/customer/navbar";
import SearchClient from "@/components/customer/search-client";

export const metadata = {
  title: "Search | FoodHouse",
};

export default async function SearchPage({ searchParams }: any) {
  // 1. Server reads the URL
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
        <SearchClient query={query} />
      </main>
    </div>
  );
}
