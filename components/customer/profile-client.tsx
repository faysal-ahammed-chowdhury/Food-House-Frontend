"use client";

import { useState } from "react";

export default function ProfileClient() {
  const [profile, setProfile] = useState({
    name: "Customer 1",
    email: "customer1@test.com",
    phone: "01711000000",
    address: "50 Residential Area, Food City",
    role: "CUSTOMER",
  });

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Handlers for simulating backend updates
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated successfully!"); // In real app: API call here
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPasswords({ newPassword: "", confirmPassword: "" }); // Clear fields
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This cannot be undone.",
      )
    ) {
      alert("Account deleted.");
    }
  };

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
              {profile.name.charAt(0).toUpperCase()}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-extrabold text-[#1a202c]">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#f0146b] focus:ring-1 focus:ring-[#f0146b] transition-colors"
                  required
                />
              </div>

              {/* Email Address (Disabled per PRD) */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-extrabold text-[#1a202c]">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
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
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                Phone Number
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#f0146b] focus:ring-1 focus:ring-[#f0146b] transition-colors"
                required
              />
            </div>

            {/* Default Delivery Address */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-extrabold text-[#1a202c]">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                Default Delivery Address
              </label>
              <textarea
                rows={3}
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#f0146b] focus:ring-1 focus:ring-[#f0146b] transition-colors resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="mt-2 w-full bg-[#f0146b] hover:bg-pink-600 transition-colors text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                ></path>
              </svg>
              Save Profile
            </button>
          </form>
        </div>

        {/* --- CARD 2: SECURITY --- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            <svg
              className="w-6 h-6 text-[#f0146b]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
            <h2 className="text-xl font-extrabold text-[#1a202c]">Security</h2>
          </div>

          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-extrabold text-[#1a202c]">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="********"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#f0146b] focus:ring-1 focus:ring-[#f0146b] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-extrabold text-[#1a202c]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="********"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
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
          <h2 className="text-xl font-extrabold text-red-600 mb-2">
            Danger Zone
          </h2>
          <p className="text-gray-500 mb-6">
            Once you delete your account, there is no going back. Please be
            certain.
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
