import Link from "next/link";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Header({ restaurant_id, name }: { restaurant_id: string; name: string }) {
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
          <p className="ml-2">{name}</p>
        </Link>

        <button onClick={handleLogout} className="cursor-pointer ml-8">
            <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}