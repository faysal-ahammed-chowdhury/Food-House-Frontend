import Link from "next/link";

const MiddleSection = () => {
  return (
    <div className="mx-8 my-6 relative rounded-[2rem] overflow-hidden h-[400px] flex items-center">
      {/* Background Image (Using an Unsplash placeholder) */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop')" }}
      >
        {/* Dark overlay to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 px-16 w-full max-w-4xl">
        <h1 className="text-[3.5rem] font-extrabold text-white leading-tight mb-8 drop-shadow-md">
          Food you love,<br/>
          <span className="text-pink-500">delivered to your<br/>door</span>
        </h1>
        
        {/* Search Box */}
        <div className="flex items-center bg-white rounded-full p-2 w-full max-w-2xl shadow-lg">
          <div className="pl-4 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            placeholder="Enter restaurant name or item name" 
            className="flex-1 outline-none px-4 text-gray-600 bg-transparent"
          />
          <Link href="/customer/search" className="bg-pink-500 hover:bg-pink-600 transition-colors text-white font-bold py-3 px-8 rounded-full">
            Find Food
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MiddleSection;