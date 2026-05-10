import Navbar from '@/components/customer/navbar'
import MiddleSection from '@/components/customer/middle-section'
import PopularCategories from '@/components/customer/popular-categories'
import TopRestaurants from '@/components/customer/top-resturant'

export default function HomePage() {
  return (
    <main className="max-w-7xl xl:mx-auto w-full">
      <Navbar />
      <MiddleSection />
      <PopularCategories />
      <TopRestaurants />
    </main>
  )
}
