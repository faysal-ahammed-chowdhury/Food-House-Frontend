"use client";
import Footer from "@/components/restaurants/footer";
import Header from "@/components/restaurants/header";
import Sidebar from "@/components/restaurants/sidebar";
import AuthContext from "@/contexts/auth/auth-context";
import { UserRoles } from "@/enums/user-roles.enum";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useContext, useEffect } from "react";

export default function RestaurantLayout({children,params}: Readonly<{children: React.ReactNode}> & { params: Promise<{ restaurant_id: number }> }) {
    const router = useRouter();   
    const authContext = useContext(AuthContext);
    const { restaurant_id } = use(params);
    const getResturentID = async (UserID: number) => {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/restaurant/getRestaurantIdbyuserID/${UserID}`,
            {withCredentials: true}
        );
        return res.data.restaurantId;
    };

 useEffect(() => {
  const redirectUser = async () => {
    if (authContext?.isLoadingUser) return;
    const user = authContext?.user;

    if (!user) {
      router.push("/auth/login");
      return;
    }
    if(user.role === UserRoles.ADMIN){
      router.push("/admin");
      return;
    }

    if (user.role === UserRoles.CUSTOMER) {
      router.push("/");
      return;
    }

    if (user.role === UserRoles.RESTAURANT) {
      console.log("User ID:", user.userId)
      const restaurantId = await getResturentID(user.userId);
    //   console.log("Fetched Restaurant ID:", restaurantId);
    //   console.log("Route Restaurant ID:", restaurant_id);
      if(restaurantId != restaurant_id){
        router.push("/auth/login");
        return;
      }
      return;
    }

    if (user.role === UserRoles.RIDER) {
      router.push("/rider");
      return;
    }
  };
  redirectUser();
}, [authContext?.user, authContext?.isLoadingUser, router]);

  return (
    <>  
    <Header restaurant_id={restaurant_id.toString()} />
    <div className="bg-white">
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <div className="flex flex-1">
                <aside className="w-64 hidden md:block bg-white border-r border-slate-200">
                    <Sidebar restaurant_id={restaurant_id.toString()} />
                </aside>
            
                <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                    {children}
               </main>
            </div>     
        </div>
        <Footer />
    </div>
    </>
  );
}
