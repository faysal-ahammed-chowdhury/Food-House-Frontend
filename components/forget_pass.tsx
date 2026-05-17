"use client"

import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";
import { FormField } from "./restaurants/form_field";
import axios from "axios";



export default function ForgetPasswordForm({ show_FORGET_PASSWORD_modal, onSuccess }: { show_FORGET_PASSWORD_modal: boolean; onSuccess: () => void }) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [step_count, setStep_count] = useState(1);
    const [USER_ID, setUSER_ID] = useState(0);
    const [formData, setFormData] = useState({
        email: "",
        opt: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        resetFormData();
        setErrors({});
        setStep_count(1);
        setUSER_ID(0);
    }, [show_FORGET_PASSWORD_modal]);

    const resetFormData = () => {
        setFormData({
            email: "",
            opt: "",
            newPassword: "",
            confirmPassword: ""
        });
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

    const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        if(step_count === 1) {
            if(isValidEmail(formData.email) === false){
                setErrors({ email: "Invalid Email" });
                return;
            }
            try{
                console.log(formData.email);
                const URL=`${process.env.NEXT_PUBLIC_API_URL}/auth/email_exist/${formData.email}/`;
                const response = await axios.get(URL);
                if(response.status === 200){
                    if(response.data.userId===0){
                        setErrors({ email: "Email not found" });
                    } else {
                        try{
                            const sendOTP_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/send_otp`;
                            const otpResponse = await axios.post(sendOTP_URL, { userId: response.data.userId,email: formData.email });
                            if(otpResponse.status === 201){
                                 setUSER_ID(response.data.userId);
                                setStep_count(2);
                            }
                            else{
                                setErrors({ email: "Failed to send OTP" });
                            }
                           
                        }catch(error){
                            setErrors({ email: "Network error" });
                        }
                    }
                }
            }catch(error){
                setErrors({ email: "Email not found" });
            }
            
        }

        else if(step_count === 2) {
            if(formData.opt.trim().length !== 6){
                setErrors({ opt: "Invalid OT1P" });
                return;
            }
            try{
                const verifyOTP_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/verifyOTP`;
                console.log(USER_ID, formData.opt);
                const response = await axios.post(verifyOTP_URL, { userId: USER_ID, otp: formData.opt });
                if(response.data.success){
                    setStep_count(3);
                } else {
                    setErrors({ opt: "Invalid OTP" });
                }
            }catch(error){
                setErrors({ opt: "Network error" });
            }
        }

        else if(step_count === 3) {
            if(formData.newPassword.length < 6){
                setErrors({ newPassword: "Password must be at least 6 characters" });
                return;
            }
            if(formData.newPassword !== formData.confirmPassword){
                setErrors({ confirmPassword: "Passwords do not match" });
                return;
            }
            try{
                const resetPassword_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/new_password`;
                const response = await axios.post(resetPassword_URL, { userId: USER_ID, newPassword: formData.newPassword });
                if(response.status === 201){
                    setStep_count(4);
                }
                else{
                    setErrors({ confirmPassword: "Failed to reset password" });
                }
            }catch(error){
                setErrors({ confirmPassword: "Network error" });
            }
        }
        else if(step_count === 4) {
            onSuccess();
        }
    }


    return(
        <>  
            <form className="space-y-6" onSubmit={handleSubmit}>
                {step_count === 1 && (
                    <FormField label="Email" icon={Mail} name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} error={errors.email} />
                )}
                {step_count === 2 && (
                    <>
                    <FormField label="OTP" icon={Mail} name="opt" placeholder="Enter OTP" value={formData.opt} onChange={handleChange} error={errors.opt} />
                    <p className="text-center">OPT sent to your email, verify your identity.</p>
                    </>
                )}
                {step_count === 3 && (
                    <><FormField label="New Password" icon={Mail} name="newPassword" placeholder="Enter new password" type="password" value={formData.newPassword} onChange={handleChange} error={errors.newPassword} />
                    <FormField label="Confirm Password" icon={Mail} name="confirmPassword" placeholder="Confirm new password" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
                    </>
                )}

                {step_count === 4 && (
                    <p className="text-center text-green-500">Password reset successfully!</p>
                )}

                <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white px-8   py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg active:scale-[0.98]">
                    {step_count === 1 && "Send OTP"}
                    {step_count === 2 && "Verify OTP"}
                    {step_count === 3 && "Reset Password"}
                    {step_count === 4 && "DONE"}
                </button>
            </form>
        </>
    )
}
