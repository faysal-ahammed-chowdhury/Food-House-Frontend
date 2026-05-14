"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AuthContext from "@/contexts/auth/auth-context";
import { z } from "zod"; 

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Full Name is required")
    .regex(/^[^0-9]+$/, "Name cannot contain numbers"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number contains numbers only")
    .length(11, "Must be exactly 11 digits")
    .regex(/^01/, "Must start with 01"),
  address: z
    .string()
    .min(5, "Delivery Address must be at least 5 characters long"),
});

const passwordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[@#$&]/, "Password must contain a special character (@, #, $, or &)"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match!",
  path: ["confirmPassword"], 
});

export default function ProfileClient() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", address: "", role: "",
  });

  const [passwords, setPasswords] = useState({
    newPassword: "", confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (authContext?.isLoadingUser) return;
    if (!authContext?.user) {
      router.push("/auth/login");
      return;
    }
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/customers/profile`, {
          withCredentials: true, 
        });
        const customerData = response.data;
        
        setProfile({
          name: customerData.user.name || "",
          email: customerData.user.email || "",
          phone: customerData.phone || "",
          address: customerData.address || "",
          role: customerData.user.role || "CUSTOMER",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authContext, router]);

  // 2. SAVE PROFILE TO BACKEND
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]); 
    setSuccessMessage("");
    
    // 3. Zod Validation for Profile
    const result = profileSchema.safeParse({
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
    });

    if (!result.success) {
      // Extract all error messages into a simple string array
      const errors = result.error.issues.map((err) => err.message);
      setErrorMessages(errors);
      return;
    }

    setIsSaving(true);
    try {
      await axios.patch(`${API_URL}/customers/profile`, {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      }, {
        withCredentials: true 
      });
      
      setSuccessMessage("Profile updated successfully!"); 
      setTimeout(() => setSuccessMessage(""), 3000); 
    } catch (error: any) {
      const backendError = error.response?.data?.message;
      setErrorMessages(Array.isArray(backendError) ? backendError : [backendError || "Failed to update profile"]);
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);
    setSuccessMessage("");

    // 5. Zod Validation for Password
    const result = passwordSchema.safeParse({
      newPassword: passwords.newPassword,
      confirmPassword: passwords.confirmPassword,
    });

    if (!result.success) {
      const errors = result.error.issues.map((err) => err.message);
      setErrorMessages(errors);
      return;
    }

    try {
      const response = await axios.patch(`${API_URL}/customers/password`, {
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      }, {
        withCredentials: true
      });
    
      setSuccessMessage(response.data.message);
      setPasswords({ newPassword: "", confirmPassword: "" }); 
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      const backendError = error.response?.data?.message;
      setErrorMessages(Array.isArray(backendError) ? backendError : [backendError || "Failed to update password"]);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      alert("Account deletion endpoint needs to be created on backend!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-[#f0146b]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[2.5rem] font-bold text-[#1a202c] mb-1">
          My Profile
        </h1>
        <p className="text-gray-500 text-lg">
          Manage your account settings and delivery information
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* --- CARD 1: MAIN PROFILE --- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-[#f0146b] rounded-2xl flex items-center justify-center text-white text-4xl font-extrabold shadow-md">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a202c] mb-1">
                {profile.name}
              </h2>
              <p className="text-gray-500 uppercase tracking-wide text-sm font-semibold">
                {profile.role} Account
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
            {errorMessages.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Please fix the following errors:
                </div>
                <ul className="list-disc pl-7 text-sm text-red-600 font-medium space-y-1">
                  {errorMessages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2 text-green-600 font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                {successMessage}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-extrabold text-[#1a202c]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#f0146b] focus:ring-1 focus:ring-[#f0146b] transition-colors"
                  
                />
              </div>

              {/* Email Address (Disabled per PRD) */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-extrabold text-[#1a202c]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-slate-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-extrabold text-[#1a202c]">
                Phone Number
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#f0146b] focus:ring-1 focus:ring-[#f0146b] transition-colors"
                
              />
            </div>

            {/* Default Delivery Address */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-extrabold text-[#1a202c]">
                Default Delivery Address
              </label>
              <textarea
                rows={3}
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#f0146b] focus:ring-1 focus:ring-[#f0146b] transition-colors resize-none"
                
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className={`mt-2 w-full transition-colors text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm ${
                isSaving ? "bg-pink-300 cursor-not-allowed" : "bg-[#f0146b] hover:bg-pink-600"
              }`}
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>

        {/* --- CARD 2: SECURITY --- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-extrabold text-[#1a202c]">Security</h2>
          </div>

          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-extrabold text-[#1a202c]">New Password</label>
                <input
                  type="password"
                  placeholder="********"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#f0146b] focus:ring-1 focus:ring-[#f0146b] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-extrabold text-[#1a202c]">Confirm Password</label>
                <input
                  type="password"
                  placeholder="********"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#f0146b] focus:ring-1 focus:ring-[#f0146b] transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-slate-100 hover:bg-slate-200 text-[#1a202c] transition-colors font-bold py-4 rounded-xl shadow-sm"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* --- CARD 3: DANGER ZONE --- */}
        <div className="bg-red-50/50 rounded-2xl border border-red-100 shadow-sm p-8">
          <h2 className="text-xl font-extrabold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-gray-500 mb-6">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-white border-2 border-red-200 hover:border-red-600 hover:bg-red-50 text-red-600 transition-colors font-bold py-2.5 px-6 rounded-lg text-sm"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}