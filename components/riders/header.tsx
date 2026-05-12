/*import Link from "next/link";
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
}*/
import Link from "next/link";
import { LogOut } from "lucide-react";

interface HeaderProps {
  rider_id: string;
  isOnline?: boolean;     // Notun prop
  toggleStatus?: () => void; // Notun prop
}

export default function Header({ rider_id, isOnline, toggleStatus }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-10 py-3 border-b border-gray-100 bg-white">
      <div className="text-pink-500 font-bold text-xl">
        Food House
      </div>

      <div className="flex items-center gap-6">
        {/* Header Toggle Switch */}
        {toggleStatus && (
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
        )}

        <span className="text-pink-500 font-medium">ID: {rider_id}</span>

        <Link href="/" className="text-gray-500 flex items-center gap-1 hover:text-pink-500 transition-colors">
          Logout <LogOut size={18}/>
        </Link>
      </div>
    </header>
  );
}