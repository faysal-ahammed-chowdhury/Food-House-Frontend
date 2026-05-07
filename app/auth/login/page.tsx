"use client";

import AuthContext from "@/contexts/auth/auth-context";
import { UserRoles } from "@/enums/user-roles.enum";
import axios from "axios";
import { AlertCircle, Info, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .email("Invalid email address")
    .max(100, "Max 100 characters allowed"),

  password: z
    .string()
    .min(6, "Min 6 characters required")
    .max(32, "Max 32 characters allowed"),
});

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const authContext = useContext(AuthContext);

  const router = useRouter();

  console.log(authContext);

  useEffect(() => {
    if (authContext?.isLoadingUser) return;

    if (authContext?.user && authContext.user.role === UserRoles.CUSTOMER) {
      router.push("/");
    } else if (
      authContext?.user &&
      authContext.user.role === UserRoles.RESTAURANT
    ) {
      router.push("/restaurant");
    } else if (authContext?.user && authContext.user.role === UserRoles.RIDER) {
      router.push("/rider");
    } else if (authContext?.user && authContext.user.role === UserRoles.ADMIN) {
      router.push("/admin");
    }
  }, [authContext]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});

    try {
      const result = loginSchema.safeParse({
        email,
        password,
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

      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password },
        {
          withCredentials: true,
        },
      );

      authContext?.fetchUser();
      setEmail("");
      setPassword("");
      if (res.data.data.role === UserRoles.CUSTOMER) router.push("/");
      else router.push("/" + UserRoles.ADMIN.toLowerCase());
    } catch (err) {
      const messages = err.response?.data?.message;

      console.log(err.response);

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
    <div className="flex">
      <div className="w-[50%]"></div>
      <div className="w-[50%] bg-gray-100">
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-[440px] space-y-8">
            <div className="space-y-2">
              <h1 className="text-[40px] font-bold text-[#0A1629] tracking-tight">
                Welcome back
              </h1>
              <p className="text-[#718096] text-lg">
                Please enter your details to sign in.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.server && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="text-sm font-medium">
                    {errors.server.map((msg, i) => (
                      <p key={i}>{msg}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-[#0A1629] font-bold text-sm">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail
                      className="h-5 w-5 text-[#94A3B8]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="name@example.com"
                    className="block w-full pl-12 pr-4 py-4 border border-[#E2E8F0] rounded-2xl leading-5 bg-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D75] focus:border-transparent transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
                    <Info size={13} />
                    <span>{errors.email[0]}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-[#0A1629] font-bold text-sm">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[#FF2D75] text-sm font-bold hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      className="h-5 w-5 text-[#94A3B8]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-4 py-4 border border-[#E2E8F0] rounded-2xl leading-5 bg-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D75] focus:border-transparent transition-all"
                  />
                </div>
                {errors.password && (
                  <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
                    <Info size={13} />
                    <span>{errors.password[0]}</span>
                  </p>
                )}
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="cursor-pointer w-full bg-[#FF2D75] text-white py-4 px-4 rounded-2xl font-bold text-lg hover:bg-[#e02666]"
              >
                {isLoading ? "Signing  In..." : "Sign In"}
              </button>
            </form>

            <div className="text-center">
              <p className="text-[#718096] font-medium">
                Don't have an account?{" "}
                <a
                  href="#"
                  className="text-[#FF2D75] font-bold hover:underline"
                >
                  Create one for free
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
