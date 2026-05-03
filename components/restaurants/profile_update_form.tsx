"use client"

import { useState } from "react";
import { FormField } from "./form_field";
import { Lock } from "lucide-react";
import { set, z } from "zod";

interface ProfileUpdateFormProps {
  formData: {
    email?: string;
    restaurantName?: string;
    description?: string;
    address?: string;
    bankAccount?: string;
    bkash?: string;
    newPassword?: string;
    confirmPassword?: string;
    bannerUrl?: string;
    isOpen?: boolean;
  };
  OnDB: {
    email?: string;
    restaurantName?: string;
    description?: string;
    address?: string;
    bankAccount?: string;
    bkash?: string;
    newPassword?: string;
    confirmPassword?: string;
    bannerUrl?: string;
    isOpen?: boolean;
  };
  restaurant_id: string;
  onSuccess: () => void;
}

const PasswordSchema = z.string().min(6, "Password must be at least 6 characters");

export default function ProfileUpdateForm({formData, OnDB, onSuccess, restaurant_id} : ProfileUpdateFormProps) {
    const [errors, setErrors] = useState("");
    const [password, setPassword] = useState("");

   

   const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors("");
    setPassword(e.target.value);
   }

   const validatePass = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors("");
    const result = PasswordSchema.safeParse(password);
    if (!result.success) {
       setErrors(result.error.issues[0].message);
    } else {
      
    }
   }



    return (
    <>  
    <div className="w-[500px] " onSubmit={validatePass}>
      <form className="flex flex-col gap-4">
        <FormField label="Enter Password" icon={Lock} type="password" name="password" value={password} onChange={handlePassChange} error={errors}/>
        <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white px-8   py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg active:scale-[0.98]">
            Confirm Password
        </button>
    </form>
    </div>
    {restaurant_id}
    </>
  );
}
