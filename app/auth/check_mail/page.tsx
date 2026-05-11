"use client";

import { Mail } from "lucide-react";
import Link from "next/link";

export default function CheckMailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
        {/* Icon Header */}
        <div className="mb-8 flex justify-center">
          <div>
            <Mail size={40} className="text-[#FF2D75]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A1629] tracking-tight">
            Check your mail
          </h1>
          <p className="text-[#718096] text-lg leading-relaxed">
            We have sent you a mail with a{" "}
            <span className="font-semibold text-[#0A1629]">
              verification link
            </span>
            . Kindly check your inbox and click the link to verify your account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="flex items-center justify-center w-full bg-[#FF2D75] text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-[#e02666] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-pink-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
