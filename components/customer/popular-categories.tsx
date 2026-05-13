import Link from 'next/link';

const PopularCategories = () => {
  const categories = [
    { name: 'Burgers', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&auto=format&fit=crop' },
    { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop' },
    { name: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop' },
    { name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=500&auto=format&fit=crop' },
  ];

  return (
    <div className="px-8 py-8">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Popular Categories</h2>
      
      <div className="grid grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Link key={index} href={`/customer/search?query=${category.name.toLowerCase()}`}className="relative h-48 rounded-2xl overflow-hidden cursor-pointer group shadow-sm block">
            {/* Image Background */}
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${category.image})` }}></div>
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/10 to-transparent"></div>
            
            {/* Centered Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-bold tracking-wide drop-shadow-lg">{category.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularCategories;