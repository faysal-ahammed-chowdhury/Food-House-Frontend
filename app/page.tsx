"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation'; 

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative bg-pink-600 flex-col justify-center items-center px-12 text-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070')" }}
        ></div>
        <div className="absolute inset-0 bg-[#e21b70] opacity-80 mix-blend-multiply"></div>
        
        <div className="relative z-10 text-white mt-10">
          <div className="flex justify-center">
            <Image src="/logo_white.png" height={10} width={220} alt="Logo" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Delicious food, <br /> delivered to your <br /> doorstep.
          </h1>
          <p className="text-lg font-medium text-pink-50 max-w-md mx-auto">
            Create an account and get access to exclusive deals, fast delivery,
            and the best restaurants in your area.
          </p>
        </div>
        <div className="absolute bottom-6 left-6 text-white text-sm font-semibold z-10">
           © 2026 FOOD HOUSE
        </div>
      </div>
      
      <section className="flex-1 flex flex-col items-center justify-center bg-white px-8">
        <div className="w-full max-w-sm text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h2>
          <p className="text-gray-500 mb-10">Choose an option to get started.</p>

          <div className="space-y-4">
            <button 
              className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-200"
              onClick={() => router.push("/auth/login")}
            >
              Sign In
            </button>
            <button 
              className="w-full py-4 bg-white border-2 border-gray-200 hover:border-pink-600 hover:text-pink-600 text-gray-700 font-bold rounded-xl transition-all"
              onClick={() => router.push("/auth/signup")}
            >
              Create Account
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}