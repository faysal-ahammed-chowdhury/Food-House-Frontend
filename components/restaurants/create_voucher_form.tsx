"use client";
import { FormField } from "@/components/restaurants/form_field";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";


const voucherSchema = z.object({
    restaurantId: z.number(),
    voucherCode: z.string().min(1, "Voucher code is required"),
    percent: z.number().min(1, "Discount percentage must be at least 1").max(100, "Discount percentage cannot exceed 100"),
    maxDiscount: z.number().min(50, "At least 50"),
    minOrderAmount: z.number().min(100, "Min order price at least 100"),
    expiresAt: z.string().datetime()
});


export default function CreateVoucherForm({restaurant_id, onSuccess} : {restaurant_id: string, onSuccess: () => void}) {
    const [formData, setFormData] = useState({
        voucherCode: "",
        percent: "",
        maxDiscount: "",
        minOrderAmount: "",
        expiresAt: "",
    });
    const [Errors, seterrors] = useState<Record<string, string>>({});

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
        if(Errors[e.target.name]){
            seterrors(prev => {
                const newErrors = {...prev};
                delete newErrors[e.target.name];
                return newErrors;
            });
        }
    }




    const validateAndSubmit = async () => {
        seterrors({});
        let DATE = "";
        try { DATE = new Date(formData.expiresAt).toDateString();}
        catch (error) { DATE = "";}
        if(DATE === "Invalid Date"){
            seterrors({expiresAt: "Invalid Information"});
            return;
        }
        const parsedData = voucherSchema.safeParse({
            restaurantId: Number(restaurant_id),
            voucherCode: formData.voucherCode,
            percent: Number(formData.percent),
            maxDiscount: Number(formData.maxDiscount),
            minOrderAmount: Number(formData.minOrderAmount),
            expiresAt: new Date(formData.expiresAt).toISOString() || undefined,
        });


        if (!parsedData.success) {
            parsedData.error.issues.forEach((err: z.ZodIssue) => {
            const key = err.path[0] as string;
                seterrors((prevErrors) => ({...prevErrors, [key]: err.message}));
            });
        }
        else{
            try {
                const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/voucher`;
                const response = await axios.post(RQ_URL, parsedData.data, {withCredentials: true});
                if(response.status === 201){
                    seterrors({});
                    setFormData({
                        voucherCode: "",
                        percent: "",
                        maxDiscount: "",
                        minOrderAmount: "",
                        expiresAt: "",
                    });
                    onSuccess();
                }
                else{
                    alert("Failed to create voucher. Please try again.");
                }
            }
            catch (error) {
                console.error(error);
            }
        }   
    }

  
     useEffect(() => {
        console.log("FormData state updated to:", formData);
     }, [formData]);

        

    return (
        <>  
            <div className="max-w-2xl">
                <FormField label="Expires At" type="datetime-local" name="expiresAt"  value={formData.expiresAt} onChange={handleChange} error={Errors.expiresAt}
                    onFocus={(e: { target: { showPicker: () => any; }; }) => e.target.showPicker()} /> <br></br>
                <FormField label="Voucher Code" type="text" name="voucherCode"  value={formData.voucherCode} onChange={handleChange} error={Errors.voucherCode} /><br></br>
                <FormField label="Discount Percentage" type="number" name="percent" value={formData.percent} onChange={handleChange} error={Errors.percent} /><br></br>
                <FormField label="Max Discount" type="number" name="maxDiscount" value={formData.maxDiscount} onChange={handleChange} error={Errors.maxDiscount} /><br></br>
                <FormField label="Min Order Amount" type="number" name="minOrderAmount" value={formData.minOrderAmount} onChange={handleChange} error={Errors.minOrderAmount} />
                
                    <br></br> 
                    <button className="w-full mx-auto block align-middle text-white text-align-center px-6 py-3 rounded-xl font-bold items-center transition-all active:scale-95 shadow-lg bg-pink-600 hover:bg-pink-700"
                        onClick={validateAndSubmit}
                    >
                        Create Voucher
                    </button>

            </div>
        </>
    )
}