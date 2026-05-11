"use client";
import { FormField } from "@/components/restaurants/form_field";
import axios from "axios";
import { useState } from "react";
import { z } from "zod";


const categorySchema = z.object({
    restaurantId: z.number(),
    name: z.string().min(1, "Category name is required")
});


export default function CreateCategoryForm({restaurant_id, onSuccess} : {restaurant_id: string, onSuccess: () => void}) {
    const [formData, setFormData] = useState({
        name: "",
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

    const submitForm = async () => {
        seterrors({});
        const parsedData = categorySchema.safeParse({
            restaurantId: Number(restaurant_id),
            name: formData.name,
        });
        if(!parsedData.success){
            parsedData.error.issues.forEach((err: z.ZodIssue) => {
            const key = err.path[0] as string;
                seterrors((prevErrors) => ({...prevErrors, [key]: err.message}));
            });
        }
        else{
            try{
                const URL= `${process.env.NEXT_PUBLIC_API_URL}/restaurant/categoryName/${restaurant_id}/${formData.name}`;
                const checkResponse = await axios.get(URL);
                if(checkResponse.status === 200){
                    seterrors({ name: "A category with this name already exists." });
                    return;
                }
            } catch (error) {
                try {
                const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/restaurants/category`;
                const response = await axios.post(RQ_URL, parsedData.data);
                if(response.status === 201){
                    setFormData({
                        name: "",
                    });
                }
                onSuccess();
                } catch (error) {
                    console.error("Error creating category:", error);
                }
            }
        }

    }

    return (
        <>
            <FormField label="Category Name" type="text" name="name"  value={formData.name} onChange={handleChange} error={Errors.name} /><br></br>

            <button type="button"
                className="w-full mx-auto block align-middle text-white text-align-center px-6 py-3 rounded-xl font-bold items-center transition-all active:scale-95 shadow-lg bg-pink-600 hover:bg-pink-700"
                onClick={submitForm}
            >
                <span className="text-lg">+ Create Category</span>
            </button>
            {/* </div>   */}
        </>
   )
}