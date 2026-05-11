"use client"

import { useContext, useEffect, useState } from "react";
import { FormField } from "./form_field";
import { Lock } from "lucide-react";
import { z } from "zod";
import axios from "axios";
import AuthContext from "@/contexts/auth/auth-context";


interface ProfileUpdateFormProps {
  formData: {
    email?: string;
    name?: string;
    description?: string;
    address?: string;
    bankAccount?: string;
    bkashAccount?: string;
    newPassword?: string;
    confirmPassword?: string;
    bannerUrl?: string;
    isOpen?: boolean;
  };
  OnDB: {
    email?: string;
    name?: string;
    description?: string;
    address?: string;
    bankAccount?: string;
    bkashAccount?: string;
    newPassword?: string;
    confirmPassword?: string;
    bannerUrl?: string;
    isOpen?: boolean;
  };
  restaurant_id: string;
  IsSHOWN?: boolean;
  onSuccess: () => void;
}

const PasswordSchema = z.string().min(6, "Password must be at least 6 characters");

export default function ProfileUpdateForm({formData, OnDB, onSuccess, restaurant_id, IsSHOWN} : ProfileUpdateFormProps) {
    const authContext = useContext(AuthContext);
    const [errors, setErrors] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
      setPassword("");
      setErrors("");
    }, [IsSHOWN]);

   const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors("");
    setPassword(e.target.value);
   }

   const validatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors("");
    const result = PasswordSchema.safeParse(password);
    if (!result.success) {
       setErrors(result.error.issues[0].message);
    } 
    else {
      const URL= `${process.env.NEXT_PUBLIC_API_URL}/restaurant/matchPassword`;
      const payload = {
        restaurantId: Number(restaurant_id),
        password: password
      };

      console.log(payload)

      try{
        const response = await axios.post(URL, payload, {withCredentials: true});
        // console.log(response.data.match);
        // console.log(restaurant_id)
        // console.log(password)
        if(response.data.match===true){
          setPassword("");
          setErrors("");
          const updatePayload = {};
          const fields = ["email", "name", "description", "address", "bankAccount", "bkashAccount"];
          
          fields.forEach((field) => {
            const newValue = (formData as any)[field];
            const oldValue = (OnDB as any)[field];
            if (newValue !== undefined && newValue !== oldValue) {
              (updatePayload as any)[field] = newValue;
            }
          });
          const updateURL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/restaurants/${restaurant_id}`;
          const updateResponse = await axios.put(updateURL, updatePayload, {withCredentials: true});
          console.log(updatePayload);
           console.log(formData);
            console.log(updatePayload);

          // console.log(updateResponse.data.success);
          if(updateResponse.data.success===true){
            authContext?.fetchUser();
            alert("Profile updated successfully!");
            onSuccess();
          }
          else{
            alert("Failed to update profile. Please try again later.");
          }     
        }
        else{
          setPassword("");
          setErrors("Incorrect password. Please try again.");
          return;
        }
      }
      catch(error){  
        console.error('Access Denied');
      }
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
    </>
  );
}
