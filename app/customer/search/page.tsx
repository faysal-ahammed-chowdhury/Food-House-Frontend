import Navbar from "@/components/customer/navbar";
import SearchClient from "@/components/customer/search-client";
import axios from "axios";

export const metadata = {
  title: "Search | FoodHouse",
};

export default async function SearchPage({ searchParams }: any) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.query || "";
  let searchResults = { restaurants: [], items: [] };

  if (query) {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${API_URL}/customers/search?query=${query}`);
      
      if (response.data) {
        searchResults = response.data;
      }
    } catch (error) {
      console.error("Failed to fetch search results.", error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-gray-100">
        <main className="max-w-6xl xl:mx-auto w-full">
          <Navbar />
        </main>
      </div>

      <main className="max-w-6xl xl:mx-auto w-full px-8 py-10">
        <SearchClient query={query} initialResults={searchResults} />
      </main>
    </div>
  );
}