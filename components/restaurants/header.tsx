import Link from "next/link";
import Image from "next/image";
import { LogOut, User } from "lucide-react";

export default function Header({ user_id, name }: { user_id: string; name: string }) {
  return (
    <header className="flex justify-between items-center px-10 py-3 border-b border-gray-100">
      <div className="logo">
        <Image src="/logo.jpeg" height={10} width={180} alt="Logo" />
      </div>

      <div className="right flex items-center">
        <Link
          href={`/restaurants/${user_id}/profile`}
          className="text-gray-600 flex items-center font-medium hover:text-pink-500 transition"
        >
          <User size={18} />
          <p className="ml-2">{name}</p>
        </Link>

        <Link href="/" className="ml-8">
          <LogOut size={18} />
        </Link>
      </div>
    </header>
  );
}