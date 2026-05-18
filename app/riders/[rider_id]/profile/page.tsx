"use client";
 
import Footer from "@/components/riders/footer";
import FormField from "@/components/riders/formfield";
import Header from "@/components/riders/header";
import Sidebar from "@/components/riders/sidebar";
import { User, Mail, Phone,  CreditCard, Smartphone, Lock, Save, ShieldCheck } from "lucide-react";
import { use, useState, useEffect, useContext } from "react";
import { z } from "zod";
import axios from "axios";
import AuthContext from "@/contexts/auth/auth-context";
import { useRouter } from "next/navigation";

 
////---schema
const riderSchema = z.object({  
 
  name: z.string()
   .nonempty("Rider name is required.")
   .max(100, "Max 100 characters allowed."),
 
 
  /*name: z.string().superRefine((val, ctx) => {
    if (val.trim() === "") {
      return;
      //ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Rider name is required."});
    }
    if (val.length > 100) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Max 100 characters allowed." });
    }
    //.nonempty("Rider name is required.")
   // .max(50, "Max 50 characters allowed."),
   }),*/
 
 
  email: z.string()
    .nonempty("Email is required.")
    .email("Invalid email format."),
 
  phone: z.string()
    .nonempty("Phone number is required.")
    .regex(/^(?:\+88)?01[0-9]{9}$/, "Invalid Bangladeshi phone number."),
 
  riderNid: z.string()
    .nonempty("NID is required.")
    .min(10, "NID must be between 10 and 17 digits.")
    .max(17, "NID must be between 10 and 17 digits."),
 
  nidImageUrl: z.string().optional(),
 
  bkashAccount: z.string().superRefine((val, ctx) => {
    if (val === "") return;
    if (!/^(?:\+88)?01[0-9]{9}$/.test(val)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid bKash number." });
    }
  }),
 
 
  bankAccount: z.string().superRefine((val, ctx) => {
    if (val === "") return;
    if (!/^\d+$/.test(val)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must be numeric." });
    } else if (val.length < 10) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Minimum 10 digits required." });
    }
    else if (val.length > 20) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Maximum 20 digits allowed." });
    }
  }),
 
 
  newPassword: z.string()
    .min(6, "Password must be at least 6 characters.")
    .max(32, "Password must not exceed 32 characters.")
    .optional()
    .or(z.literal('')),
 
  oldPassword: z.string().optional().or(z.literal('')),
 
  confirmPassword: z.string().optional().or(z.literal('')),
 
})
.superRefine((data, ctx) => {
  const isChangingPassword = data.newPassword && data.newPassword.length > 0;
 
  if (!isChangingPassword) return;
 
  // old password required
  if (!data.oldPassword || data.oldPassword.trim().length === 0) {
    ctx.addIssue({
      path: ["oldPassword"],
      message: "Old password is required.",
      code: z.ZodIssueCode.custom
    });
  }
 
  // confirm password match
  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      path: ["confirmPassword"],
      message: "Passwords do not match.",
      code: z.ZodIssueCode.custom
    });
  }
});
 
 
export default function Profile({ params }: { params: Promise<{ rider_id: string }>}){
  const { rider_id } = use(params);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    riderNid: "",
    nidImageUrl: "",
    bkashAccount: "",
    bankAccount: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
 
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOnline, setIsOnline] = useState(false);
  const [msg, setMsg] = useState("");
  const authContext = useContext(AuthContext);

 
  useEffect(() => {
    fetchProfile();
  },[rider_id]);
 

 
  async function fetchProfile() {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/rider/riders/" + rider_id,{withCredentials: true});
      const data = response.data.data;
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        riderNid: data.riderNid || "",
        nidImageUrl: data.nidImageUrl || "",
        bkashAccount: data.bkashAccount || "",
        bankAccount: data.bankAccount || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsOnline(data.isOnline || false);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
 
 ////////

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  let flag=true;
  const id = Number(rider_id);

  // validation
  const result = riderSchema.safeParse(formData);

  if (!result.success) {
    const newErrors: Record<string, string> = {};

    result.error.issues.forEach((err: any) => {
      const key = err.path[0] as string;
      if (!newErrors[key]) {
        newErrors[key] = err.message;
      }
    });

    setErrors(newErrors);
    return;
  }

  if(formData.bkashAccount.length===0){
    setErrors(prev => ({
      ...prev,
      bkashAccount: "Bkash account is required"
    }));
    flag=false;
  }
  if(formData.bankAccount.length===0){
    setErrors(prev => ({
      ...prev,
      bankAccount: "Bank account is required"
    }));
    flag=false;
  }
  if(!flag) return;
  try {
    let passwordChanged = false;

    // PASSWORD FLOW
    // =========================
    const hasPasswordChange =
      formData.oldPassword ||
      formData.newPassword ||
      formData.confirmPassword;

    if (hasPasswordChange) {
          if (
        !formData.oldPassword ||
        !formData.newPassword ||
        !formData.confirmPassword
      ) {
        setErrors(prev => ({
          ...prev,
          oldPassword: "All password fields are required",
        }));
        return;
      }

      // old password check
      const check = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/rider/riders/check-password`,
        {
          riderId: id,
          password: formData.oldPassword,
        },{withCredentials: true}
      );

      if (!check.data.matched) {
        setErrors(prev => ({
          ...prev,
          oldPassword: "Old password is incorrect",
        }));
        return;
      }

      // confirm password match 
      if (formData.newPassword !== formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
        return;
      }

      // update password
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/rider/riders/change-password/${id}`,
        {
          riderId: id,
          newPassword: formData.newPassword,
        },{withCredentials: true}
      );

      passwordChanged = true;
    }

    
    // PROFILE UPDATE
    // =========================
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/rider/riders/${id}`,
      {
        name: formData.name,
        phone: formData.phone,
        bkashAccount: formData.bkashAccount,
        bankAccount: formData.bankAccount,
      },{withCredentials: true}
    );

    if (response.data.success) {
      fetchProfile();
      setMsg("Profile updated successfully!");
      alert("Profile updated successfully!");

      // clear password fields only if used
      if (passwordChanged) {
        setFormData(prev => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    } else {
      alert("Failed to update profile. Please try again.");
    }
  } catch (error) {
  console.error("Error updating profile:", error);
  setMsg("Something went wrong!");
}
};
const router = useRouter();
const handleDeleteAccount = async () => {
  const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");

  if (!confirmDelete) return;

  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/rider/${rider_id}`,
      { withCredentials: true }
    );

    if (res.data) {
      alert("Account deleted successfully!");

      // redirect to login / homepage
      //window.location.href = "/login"; 
      try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,{},{withCredentials: true,});
      await authContext?.fetchUser?.();
      router.push("/");
    } catch {}
    }
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete account.");
  }
};


 
 
  

  return (

        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-blue-900">Rider Profile</h1>
              <p className="text-gray-500">ID: <span className="font-mono text-blue-600 font-bold">{rider_id}</span></p>
            </header>
 
            <form onSubmit={handleSubmit} className="space-y-8">
              {msg && (
              <p className="text-green-600 font-semibold text-center">
                {msg}
              </p>
            )}
              {/* Personal Info */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                  <User size={20} className="text-blue-500"/> Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Full Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} icon={User} />
                  <FormField label="Email Address" name="email" value={formData.email} onChange={handleChange}  icon={Mail} disabled />
                  <FormField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} icon={Phone} />
                  <FormField label="National ID (NID)" name="riderNid" value={formData.riderNid} onChange={handleChange}  icon={ShieldCheck} disabled />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">NID Image</label>
                   <img
                      src={process.env.NEXT_PUBLIC_API_URL + "/rider/getimage/" + formData.nidImageUrl}
                      className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md flex-shrink-0"
                      alt="nid"
                    />
                  </div>
              </section>
 
              {/* Payout Info */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                  <CreditCard size={20} className="text-emerald-500"/> Payout Accounts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="bKash Number" name="bkashAccount" value={formData.bkashAccount} onChange={handleChange} error={errors.bkashAccount} icon={Smartphone} />
                  <FormField label="Bank Account" name="bankAccount" value={formData.bankAccount} onChange={handleChange} error={errors.bankAccount} icon={CreditCard} />
                </div>
              </section>
 
              {/* Password Section */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                  <Lock size={20} className="text-amber-500"/> Security</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField label="Old Password"  type="password"  name="oldPassword"  value={formData.oldPassword}  onChange={handleChange} error={errors.oldPassword} icon={Lock}/>
                  <FormField label="New Password" type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} error={errors.newPassword} icon={Lock} />
                  <FormField label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} icon={Lock} />
                </div>
              </section>
 
 
 
              <button type="submit" className="w-full bg-pink-500 hover:bg-pink-700 text-2xl text-white py-4 rounded-xl font-mono font-light flex justify-center items-center gap-2 transition-all shadow-lg active:scale-[0.98]">
                <Save size={20} /> Save Profile
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="w-full bg-red-500 hover:bg-red-700 text-white py-4 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all shadow-lg mt-4">
                Delete Account
              </button>
            </form>
          </div>
        </main>
  );
}
 
// ------  