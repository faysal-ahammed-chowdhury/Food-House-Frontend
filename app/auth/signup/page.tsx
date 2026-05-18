"use client";

import AuthContext from "@/contexts/auth/auth-context";
import { UserRoles } from "@/enums/user-roles.enum";
import axios from "axios";
import { CheckCircle, CircleX, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string()
    .min(1, "Customer name is required")
    .max(100, "Max 100 characters allowed"),

  email: z
    .email("Invalid email address")
    .max(100, "Max 100 characters allowed"),

  password: z
    .string()
    .min(6, "Min 6 characters required")
    .max(32, "Max 32 characters allowed"),

  address: z
    .string()
    .min(1, "Address is required")
    .max(100, "Max 100 characters allowed"),

  phone: z.string().regex(/^(?:\+88)?01[0-9]{9}$/, "Invalid phone number"),
});

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const authContext = useContext(AuthContext);

  const router = useRouter();

  console.log(authContext);

  const getResturentID = async (UserID: number) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/restaurant/getRestaurantIdbyuserID/${UserID}`,
      {
        withCredentials: true,
      },
    );
    return res.data.restaurantId;
  };

  useEffect(() => {
    if (authContext?.isLoadingUser) return;

    const handleNavigation = async () => {
      const { user } = authContext || {};

      if (!user) return;

      if (user.role === UserRoles.CUSTOMER) {
        router.push("/customer/dashboard");
      } else if (user.role === UserRoles.RESTAURANT) {
        try {
          const restaurantID = await getResturentID(user.userId);
          router.push(`/restaurants/${restaurantID}/dashboard`);
        } catch (error) {
          console.error("Failed to fetch Restaurant ID:", error);
        }
      } else if (user.role === UserRoles.RIDER) {
        router.push("/rider");
      } else if (user.role === UserRoles.ADMIN) {
        router.push("/admin");
      }
    };

    handleNavigation();
  }, [authContext, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors({});

    const result = createCustomerSchema.safeParse({
      name,
      email,
      password,
      address,
      phone,
    });

    if (!result.success) {
      console.log(result.error.issues);

      const fieldErrors: Record<string, string[]> = {};
      result.error.issues.forEach(
        (err) => (fieldErrors[err.path[0] as string] = [err.message]),
      );
      setErrors(fieldErrors);

      return;
    }

    // console.log(result.data);
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        result.data,
        {
          withCredentials: true,
        },
      );

      //   console.log(res.data);

      setName("");
      setEmail("");
      setPassword("");
      setAddress("");
      setPhone("");

      setSuccessMsg(
        "We have sent you a mail with a verification link. Kindly check your inbox and click the link to verify your account.",
      );
      //   router.push("/auth/check_mail");
    } catch (error: any) {
      const messages = error.response?.data?.message;

      if (Array.isArray(messages)) {
        setErrors({ server: messages });
      } else {
        setErrors({ server: [messages || "Something went wrong"] });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative bg-pink-600 flex-col justify-center items-center px-12 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070')",
          }}
        ></div>
        <div className="absolute inset-0 bg-[#e21b70] opacity-80 mix-blend-multiply"></div>

        <div className="relative z-10 text-white mt-10">
          <div className="flex justify-center">
            <Image src="/logo_white.png" height={10} width={180} alt="Logo" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Start your food <br /> journey today.
          </h1>
          <p className="text-lg font-medium text-pink-50 max-w-md mx-auto">
            Create an account and get access to exclusive deals, fast delivery,
            and the best restaurants in your area.
          </p>
        </div>

        <div className="absolute bottom-6 left-6 text-white text-sm font-semibold z-10">
          © 2026 FOOD HOUSE
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Create account
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            Join Food House and start ordering.
          </p>

          {errors?.server?.length > 0 && (
            <ul className="my-5 mb-10 rounded-lg border border-red-200 bg-red-50 p-4 space-y-2">
              {errors?.server.map((msg, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-red-600"
                >
                  <CircleX size={16} />
                  <p>{msg}</p>
                </li>
              ))}
            </ul>
          )}

          {successMsg?.length > 0 && (
            <div className="my-5 mb-10 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle size={18} className="shrink-0" />
                <p className="text-sm font-medium">{successMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Siyam Talukder"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border text-gray-600 rounded-lg outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition-colors"
                />
              </div>
              {errors.name && (
                <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
                  <Info size={13} />
                  <span>{errors.name[0]}</span>
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="siyam@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border text-gray-600 rounded-lg outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition-colors"
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
                  <Info size={13} />
                  <span>{errors.email[0]}</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border text-gray-600 rounded-lg outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition-colors"
                />
              </div>
              {errors.password && (
                <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
                  <Info size={13} />
                  <span>{errors.password[0]}</span>
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border text-gray-600 rounded-lg outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition-colors"
              />
              {errors.phone && (
                <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
                  <Info size={13} />
                  <span>{errors.phone[0]}</span>
                </p>
              )}
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                placeholder="House, Road, Area"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 border text-gray-600 rounded-lg outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition-colors"
              />
              {errors.address && (
                <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
                  <Info size={13} />
                  <span>{errors.address[0]}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled={isLoading}
              type="submit"
              className="cursor-pointer w-full bg-[#f0146b] hover:bg-[#d0105b] text-white font-bold py-3.5 rounded-lg transition-colors mt-4 shadow-md"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#f0146b] font-bold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
