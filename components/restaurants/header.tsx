import Link from "next/link";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header({ restaurant_id}: { restaurant_id: string}) {
  const [displayName, setDisplayName] = useState("");
  
  useEffect(() => {
    getName();
  }, []);
  async function getName() {
     try {
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/restaurants/${restaurant_id}`;
      const response = await axios.get(RQ_URL);
      if(response.data.success){
        const jsonData = response.data.data;
        setDisplayName(jsonData.user.name);
      }
    } 
    catch (error) {
      console.error(error);
    }
  }
  
  const router = useRouter();
  const handleLogout = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      router.push("/");
      
    } catch {}
  };
  
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