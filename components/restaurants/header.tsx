import Link from "next/link";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/contexts/auth/auth-context";
import { UserRoles } from "@/enums/user-roles.enum";
import Pusher from "pusher-js";

export default function Header({ restaurant_id}: { restaurant_id: string}) {
  const [displayName, setDisplayName] = useState("");
  const authContext = useContext(AuthContext);
  useEffect(() => {
    getName();
  }, [getName]);
  async function getName() {
    if(authContext?.isLoadingUser) return;
    const user = authContext?.user;
    if(!user) return;
    if(user.role !== UserRoles.RESTAURANT) return;
    setDisplayName(user.name);
  }
  
  const router = useRouter();
  const handleLogout = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,{},{withCredentials: true,});
      await authContext?.fetchUser?.();
      router.push("/");
    } catch {}
  };

  useEffect(() => {
    const pusher = new Pusher("7b2e3ff4ee3ff76372cd", {
      cluster: "ap1",
    });
    const channel = pusher.subscribe("order-channel");
    channel.bind("new-order", (data: any) => {
      alert(data);

    });
  }, []);
  
  return (
    <header className="flex justify-between items-center px-10 py-3 border-b border-gray-100">
      <div className="logo">
        <Image src="/logo.jpeg" height={8} width={160} alt="Logo" />
      </div>

      <div className="right flex items-center">
        <Link
          href={`/restaurants/${restaurant_id}/profile`}
          className="text-gray-600 flex items-center font-medium hover:text-pink-500 transition"
        >
          <User size={18} />
          <p className="ml-2">{displayName}</p>
        </Link>

        <button onClick={handleLogout} className="cursor-pointer ml-8">
            <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}