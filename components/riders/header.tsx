import Link from "next/link";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/contexts/auth/auth-context";
import { UserRoles } from "@/enums/user-roles.enum";

export default function Header({ rider_id}: { rider_id: string}) {
  const [displayName, setDisplayName] = useState("");
  const authContext = useContext(AuthContext);
  const [isOnline, setIsOnline] = useState(false);
  useEffect(() => {
    getName();
  }, [getName]);
  async function getName() {
    if(authContext?.isLoadingUser) return;
    const user = authContext?.user;
    if(!user) return;
    if(user.role !== UserRoles.RIDER) return;
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

  async function fetchStatus() {
  try {

    console.log("Fetching status for rider ID:", rider_id);
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/rider/riders/${rider_id}/status`,{withCredentials: true}
    );
    if (response.status === 200) {
      setIsOnline(response.data.data.isOnline);
    }
  } catch (error) {
    console.error("Error fetching rider status:", error);
  }
}

useEffect(() => {
  fetchStatus();
}, []);

  const toggleStatus = async () => {
       try {
        const newStatus = !isOnline;
    
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/rider/riders/${rider_id}/status`,
          { isOnline: newStatus },{withCredentials: true}
        );
    
       fetchStatus();
       window.location.reload();
      } catch (err) {
        console.log(err);
      }
  };
  
  return (
    <header className="flex justify-between items-center px-10 py-3 border-b border-gray-100">
      <div className="logo">
        <Image src="/logo.jpeg" height={8} width={160} alt="Logo" />
      </div>

      

      <div className="right flex items-center">
        <div className="flex items-center gap-2 border-r pr-6 border-gray-100">
            <span className={`text-[10px] font-bold uppercase ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <button 
              onClick={toggleStatus}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`${isOnline ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </button>
          </div>
        <Link
          href={`/riders/${rider_id}/profile`}
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