import Link from "next/link";
import { LogOut } from "lucide-react";

export default function Header({ rider_id }: { rider_id: string }) {
  return (
   <header className="flex justify-between items-center px-10 py-3 border-b border-gray-100">
      
    
      <div className="text-pink-500">
        Food House
      </div>
       <div className="flex items-center gap-3">

        <span className="text-pink-500 text-xl">{rider_id}</span>

        <Link href="/" className="text-gray-500 flex items-center gap-1">
           Logout <LogOut size={18}/>
        </Link>
      </div>
    </header>
  );
}