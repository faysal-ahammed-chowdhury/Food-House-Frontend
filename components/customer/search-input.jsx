"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchInput({ initialQuery = "", variant = "header" }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      router.push(`/customer/search?query=${searchTerm.toLowerCase()}`);
    } 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  if (variant === "hero") {
    return (
      <div className="flex items-center bg-white rounded-full p-2 w-full max-w-2xl shadow-lg">
        <div className="pl-4 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input 
          type="text" 
          placeholder="Enter restaurant name or item name" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 outline-none px-4 text-gray-600 bg-transparent"
        />
        <button 
          onClick={handleSearch}
          className="bg-[#f0146b] hover:bg-pink-600 transition-colors text-white font-bold py-3 px-8 rounded-full"
        >
          Find Food
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-[400px]">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search restaurants or items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f0146b] focus:border-transparent text-gray-700 bg-white shadow-sm"
      />
    </div>
  );
}