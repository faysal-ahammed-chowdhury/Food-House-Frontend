import ProfileClient from "@/components/customer/profile-client";

export const metadata = {
  title: "My Profile | FoodHouse",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl xl:mx-auto w-full px-8 py-10">
        <ProfileClient />
      </main>
    </div>
  );
}
