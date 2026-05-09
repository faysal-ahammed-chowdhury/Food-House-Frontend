"use client";

import Footer from "@/components/riders/footer";
import FormField from "@/components/riders/formfield";
import Header from "@/components/riders/header";
import Sidebar from "@/components/riders/sidebar";
import { User, Mail, Phone,  CreditCard, Smartphone, Lock, Save, ShieldCheck } from "lucide-react";
import { use, useState } from "react";
import { z } from "zod";

////---schema
const riderSchema = z.object({  

  riderName: z.string()
   .nonempty("Rider name is required.") 
   .max(50, "Max 50 characters allowed."),


  /*riderName: z.string().superRefine((val, ctx) => {
    if (val.trim() === "") {
      return;
      //ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Rider name is required."});
    }
    if (val.length > 5) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Max 50 characters allowed." });
    }
    //.nonempty("Rider name is required.")
   // .max(50, "Max 50 characters allowed."),
   }),*/
    
  
  email: z.string()
    .nonempty("Email is required.")
    .email("Invalid email format."),

  phone: z.string()
    .nonempty("Phone number is required.")
    .regex(/^01[0-9]{9}$/, "Invalid Bangladeshi phone number."),

  riderNid: z.string()
    .nonempty("NID is required.")
    .length(10, "NID must be exactly 10 digits."),

  bkashAccount: z.string().superRefine((val, ctx) => {
    if (val === "") return;
    if (!/^01[0-9]{9}$/.test(val)) {
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
  }),

  
  newPassword: z.string()
    .min(6, "Password must be at least 6 characters.")
    .optional()
    .or(z.literal('')), 

  confirmPassword: z.string().optional().or(z.literal('')),

})
.refine((data) => {
  
  if (data.newPassword && data.newPassword.length > 0) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  path: ["confirmPassword"],
  message: "Passwords do not match."
});


export default function Profile({ params }: { params: Promise<{ rider_id: string }>}){
  const { rider_id } = use(params);

  // States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    riderName: "", 
    email: "",
    phone: "",
    riderNid: "",
    bkashAccount: "",
    bankAccount: "",
    newPassword: "",
    confirmPassword: "",
    nidImage: null as File | null,
    
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleNidImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    setFormData(prev => ({ ...prev, nidImage: file }));
  } 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = riderSchema.safeParse(formData);

    if (!result.success) {
      const currentErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const key = err.path[0] as string;
        currentErrors[key] = err.message;
      });
      setErrors(currentErrors);
    } else {
      setErrors({});
      alert("Profile updated successfully!");
      console.log("Submit Data:", result.data);
      
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header rider_id={rider_id}/>

      <div className="flex flex-1">
        <Sidebar rider_id={rider_id} />
        
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-blue-900">Rider Profile</h1>
              <p className="text-gray-500">ID: <span className="font-mono text-blue-600 font-bold">{rider_id}</span></p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Info */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
                  <User size={20} className="text-blue-500"/> Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Full Name" name="riderName" value={formData.riderName} onChange={handleChange} error={errors.riderName} icon={User} />
                  <FormField label="Email Address" name="email" value={formData.email} onChange={handleChange}  icon={Mail} disabled />
                  <FormField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} icon={Phone} />
                  <FormField label="National ID (NID)" name="riderNid" value={formData.riderNid} onChange={handleChange}  icon={ShieldCheck} disabled />
                </div>
                <div className="flex flex-col gap-2"> 
                  <label className="text-sm font-semibold text-slate-700 ml-1">NID Image</label>
                  <input type="file" accept="image/*" onChange={handleNidImage} disabled={formData.nidImage !== null} className="border p-2 rounded-lg w-full mt-2"/>
                </div>
              </section>

              {/* Payout Info */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
                  <CreditCard size={20} className="text-emerald-500"/> Payout Accounts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="bKash Number" name="bkashAccount" value={formData.bkashAccount} onChange={handleChange} error={errors.bkashAccount} icon={Smartphone} />
                  <FormField label="Bank Account" name="bankAccount" value={formData.bankAccount} onChange={handleChange} error={errors.bankAccount} icon={CreditCard} />
                </div>
              </section>

              {/* Password Section */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
                  <Lock size={20} className="text-amber-500"/> Security</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="New Password" type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} error={errors.newPassword} icon={Lock} />
                  <FormField label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} icon={Lock} />
                </div>
              </section>

                

              <button type="submit" className="w-full bg-pink-500 hover:bg-pink-700 text-2xl text-white py-4 rounded-xl font-mono font-light flex justify-center items-center gap-2 transition-all shadow-lg active:scale-[0.98]">
                <Save size={20} /> Save Profile
              </button>
            </form>
          </div>
        </main>
      </div>
      <Footer/>
    </div>
  );
}

// ------
