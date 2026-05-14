import SearchInput from "@/components/customer/search-input";

const MiddleSection = () => {
  return (
    <div className="mx-8 my-6 relative rounded-[2rem] overflow-hidden h-[400px] flex items-center">
      {/* Background Image*/}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop')",}}>
        {/* Dark overlay to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent"></div>
      </div>

      <div className="relative z-10 px-16 w-full max-w-4xl">
        <h1 className="text-[3.5rem] font-extrabold text-white leading-tight mb-8 drop-shadow-md">
          Food you love,
          <br />
          <span className="text-pink-500">delivered to your<br />door</span>
        </h1>

        {/* Search Box */}
        <SearchInput variant="hero" />
      </div>
    </div>
  );
};

export default MiddleSection;
