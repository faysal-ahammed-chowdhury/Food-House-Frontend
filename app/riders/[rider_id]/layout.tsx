"use client";

import Footer from "@/components/riders/footer";
import Header from "@/components/riders/header";
import Sidebar from "@/components/riders/sidebar";
import AuthContext from "@/contexts/auth/auth-context";
import { UserRoles } from "@/enums/user-roles.enum";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useContext, useEffect } from "react";

export default function RiderLayout({children,params}: Readonly<{children: React.ReactNode}> & { params: Promise<{ rider_id: number }> }) {
    const router = useRouter();   
    const authContext = useContext(AuthContext);
    const {rider_id} = use(params);

    const getRiderID = async (UserID: number) => {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/rider/rider-id/${UserID}`,
            {withCredentials: true}
        );
        return res.data;
    };

    useEffect(() => {
        const redirectUser = async () => {
            if (authContext?.isLoadingUser) return;
            const user = authContext?.user;

            if (!user) {
                router.push("/auth/login");
                return;
            }

            if (user.role === UserRoles.RIDER) {
                console.log("User ID:", user.userId);
                const riderId = await getRiderID(user.userId);
                if (riderId != rider_id) {
                    router.push("/auth/login");
                    return;
                }
                return;
            }

            router.push("/auth/login");
        };
        redirectUser();
    }, [authContext?.isLoadingUser, authContext?.user, rider_id, router]);
    
    
        
   
    return (
        <>
            <Header rider_id={rider_id.toString()} />
            <div className="bg-white">
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
                <div className="flex flex-1">
                    <aside className="w-64 hidden md:block bg-white border-r border-slate-200">
                        <Sidebar rider_id={rider_id.toString()} />
                    </aside>
                    <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                        {children}
                </main>
                </div>     
            </div>
            <Footer />
        </div>
        </>
    )
}