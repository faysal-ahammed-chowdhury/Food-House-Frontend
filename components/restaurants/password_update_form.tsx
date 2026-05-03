"use client"

import { useState } from "react";
import { FormField } from "./form_field";
import { Lock } from "lucide-react";
import z, { set } from "zod";
import axios from "axios";
import { ca } from "zod/locales";


const PasswordSchema = z.string().min(6, "Password must be at least 6 characters");

export default function PasswordUpdateForm({password, restaurant_id, onSuccess} : {password: string, restaurant_id: string, onSuccess: () => void}) {
    const [passwordErrors, setPasswordErrors ] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");    

    const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordErrors("");
        setConfirmPassword(e.target.value);
    }

    const validatePass =  async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordErrors("");
        const result = PasswordSchema.safeParse(confirmPassword);
        if (!result.success) {
           setPasswordErrors(result.error.issues[0].message);
        }
        const URL= `${process.env.NEXT_PUBLIC_API_URL}/restaurant/matchPassword`;
        const payload = {
            restaurantId: Number(restaurant_id),
            password: confirmPassword
        };
        // console.log("Sending password to backend for validation:", payload);
        
        try{ 
            const response = await axios.post(URL, payload);
            if(response.data.match===true){
                setConfirmPassword("");
                setPasswordErrors("");
                const updateURL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/restaurants/${restaurant_id}`;
                const updatePayload = {
                    password: password
                };
                // console.log("Password validated. Sending update request to backend:", updatePayload);
                const updateResponse = await axios.put(updateURL, updatePayload);
                if(updateResponse.data.success===true){
                    alert("Password updated successfully!");
                    onSuccess();
                }
                else{
                     alert("Failed to update password. Please try again later.");
                }  
            }
            else{
                setConfirmPassword("");
                setPasswordErrors("Incorrect password. Please try again.");
                return;
            }
        }
        catch(error){
            console.error("Error validating password:", error);
            setPasswordErrors("An error occurred while validating the password. Please try again.");
        }
    }

    return(
    <>
    <div className="w-[500px] " onSubmit={validatePass}>
        <form className="flex flex-col gap-4">
            <FormField
            label="Enter Password" icon={Lock} type="password" name="confirmPassword" value={confirmPassword} onChange={handlePassChange} error={passwordErrors}
            placeholder="Enter your current password"
            />
            <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white px-8   py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg active:scale-[0.98]">
                Confirm Password
            </button>
        </form>
    </div>
        </>
    )

}