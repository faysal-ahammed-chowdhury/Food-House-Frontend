"use client";

import { CircleX } from "lucide-react";
import { useEffect } from "react";

export default function MyModal({
  children,
  onClose,
  title,
  open,
}: Readonly<{
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
}>) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      onClick={onClose}
      className={`text-black fixed inset-0 z-50 bg-black/50 flex items-center justify-center ${!open ? "hidden" : ""}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-lg max-h-[90%] max-w-[90%] overflow-y-auto"
      >
        <div className="sticky top-0 p-10 pb-5 flex justify-between items-center gap-20 bg-white border-b border-gray-100">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="cursor-pointer">
            <CircleX />
          </button>
        </div>
        <div className="p-10 pt-5">{children}</div>
      </div>
    </div>
  );
}
