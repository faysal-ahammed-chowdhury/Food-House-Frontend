import Link from "next/link";

const TopRestaurants = () => {
  return (
    <div className="px-8 py-4">
      {/* Header section with title and link */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">Top Restaurants</h2>
        
        <Link href="/customer/restaurants" className="text-pink-500 font-semibold hover:text-pink-600 flex items-center gap-1 transition-colors">
          See all <span>→</span>
        </Link>
        
      </div>
      
      {/* Future restaurant cards will go here */}
      <div className="grid grid-cols-3 gap-6">
        {/* Placeholder for when you build the next step */}
      </div>
    </div>
  );
};

export default TopRestaurants;