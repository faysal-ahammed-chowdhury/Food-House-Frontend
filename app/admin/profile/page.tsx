"use client";
import AuthContext from "@/contexts/auth/auth-context";
import axios from "axios";
import {
  CheckCircle,
  CircleX,
  Info,
  Lock,
  Mail,
  User,
  UserPen,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import z from "zod";

export const updateAdminSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Max 100 characters allowed"),

  email: z
    .email("Invalid email address")
    .max(100, "Max 100 characters allowed"),
});

export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Min 6 characters required")
    .max(32, "Max 32 characters allowed"),
});

export default function ProfilePage() {
  const authContext = useContext(AuthContext);
  const [fullName, setFullName] = useState<string>(
    authContext?.user?.name || "",
  );
  const [email, setEmail] = useState<string>(authContext?.user?.email || "");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPassLoading, setIsPassLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [passError, setPassErrors] = useState<Record<string, string[]>>({});
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    setFullName(authContext?.user?.name || "");
    setEmail(authContext?.user?.email || "");
  }, [authContext]);

  const handleProfileUpdate = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    if (
      fullName === authContext?.user?.name &&
      email === authContext?.user?.email
    ) {
      return;
    }

    const result = updateAdminSchema.safeParse({
      name: fullName,
      email,
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

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/admins/${authContext?.user?.userId}`,
        result.data,
        {
          withCredentials: true,
        },
      );

      authContext?.fetchUser();
      setSuccessMsg(`Profile Updated Successfully`);

      //   console.log(res.data);
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

  const handleUpdatePassword = async (e: any) => {
    e.preventDefault();
    if (password === "") return;
    setPassErrors({});
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setPassErrors({
        password: ["Password and Confirm Password did not matched"],
      });
    }

    const result = updatePasswordSchema.safeParse({
      password,
    });

    if (!result.success) {
      console.log(result.error.issues);

      const fieldErrors: Record<string, string[]> = {};
      result.error.issues.forEach(
        (err) => (fieldErrors[err.path[0] as string] = [err.message]),
      );
      setPassErrors(fieldErrors);

      return;
    }

    setIsPassLoading(true);

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/admins/${authContext?.user?.userId}`,
        result.data,
        {
          withCredentials: true,
        },
      );

      setSuccessMsg(`Password Updated Successfully`);

      //   console.log(res.data);
    } catch (error: any) {
      const messages = error.response?.data?.message;

      if (Array.isArray(messages)) {
        setErrors({ server: messages });
      } else {
        setErrors({ server: [messages || "Something went wrong"] });
      }
    } finally {
      setIsPassLoading(false);
    }
  };

  return (
    <div className="w-[40%] mx-auto">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Profile</h1>
          <p className="text-gray-500 text-lg">
            Manage your administrative account settings
          </p>
        </div>
      </div>

      <div className="my-10">
        {errors?.server?.length > 0 && (
          <ul className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 space-y-2">
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
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle size={18} className="shrink-0" />
              <p className="text-sm font-medium">{successMsg}</p>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleProfileUpdate}
        className="bg-white rounded-2xl border-2 border-slate-200 p-8 mt-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <UserPen className="w-6 h-6 text-[#FF2D75]" strokeWidth={2.5} />
          <h2 className="text-2xl font-bold text-[#0A1629]">
            Personal Information
          </h2>
        </div>

        <div className="space-y-2 mt-10">
          <label className="block text-[#0A1629] font-bold text-sm">
            Full Name
          </label>
          <div className="relative">
            {/* Icon Container */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-[#94A3B8]" strokeWidth={1.5} />
            </div>

            {/* Input Field */}
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              className="block w-full pl-12 pr-4 py-4 border border-[#E2E8F0] rounded-2xl bg-white text-[#0A1629] focus:outline-none focus:ring-2 focus:ring-[#FF2D75] focus:border-transparent transition-all"
            />
          </div>
          {errors.name && (
            <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
              <Info size={13} />
              <span>{errors.name[0]}</span>
            </p>
          )}
        </div>
        <div className="space-y-2 mt-5">
          <label className="block text-[#0A1629] font-bold text-sm">
            Email
          </label>
          <div className="relative">
            {/* Icon Container */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-[#94A3B8]" strokeWidth={1.5} />
            </div>

            {/* Input Field */}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              className="block w-full pl-12 pr-4 py-4 border border-[#E2E8F0] rounded-2xl  bg-white text-[#0A1629] focus:outline-none focus:ring-2 focus:ring-[#FF2D75] focus:border-transparent transition-all"
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
              <Info size={13} />
              <span>{errors.email[0]}</span>
            </p>
          )}
        </div>

        <div className="mt-10">
          <button
            disabled={isLoading}
            className="w-full py-5 rounded-lg bg-pink-500 text-white font-bold cursor-pointer active:scale-[0.99]"
          >
            {isLoading ? "Updating Profile..." : "Update Profile"}
          </button>
        </div>
      </form>

      {/* password upd */}
      <form
        onSubmit={handleUpdatePassword}
        className="bg-white p-8 rounded-2xl border-2 border-slate-200 mt-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <Lock className="w-6 h-6 text-[#FF2D75]" strokeWidth={2.5} />
          <h2 className="text-2xl font-bold text-[#0A1629]">Security</h2>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* New Password Field */}
          <div className="space-y-2">
            <label className="block text-[#0A1629] font-bold text-sm">
              New Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-4 border border-[#E2E8F0] rounded-2xl bg-white text-[#0A1629] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D75] focus:border-transparent transition-all"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="block text-[#0A1629] font-bold text-sm">
              Confirm Password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-4 border border-[#E2E8F0] rounded-2xl bg-white text-[#0A1629] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D75] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {passError.password && (
          <p className="flex items-center gap-2 text-sm text-red-600 mb-4">
            <Info size={13} />
            <span>{passError.password[0]}</span>
          </p>
        )}

        {/* Action Button */}
        <button
          type="submit"
          className="cursor-pointer w-full bg-[#F1F5F9] text-[#0A1629] py-4 rounded-2xl font-bold text-lg hover:bg-[#E2E8F0] transition-colors active:scale-[0.99]"
        >
          {isPassLoading ? "Updating Password..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
