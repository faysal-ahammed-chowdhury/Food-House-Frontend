"use client";


import { FormField } from "@/components/restaurants/form_field";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";


const categorySchema = z.object({
    name: z.string().min(1, "Category name is required")
});


export default function EditCategoryForm({restaurant_id, category_id, category_name, onSuccess} : {restaurant_id: string, category_id: number, category_name: string, onSuccess: () => void}) {
    const [formData, setFormData] = useState({
        name: "",
    });
    const [pre_info, setpre_info] = useState({
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
    
    useEffect(() => {
        setFormData({name: category_name});
        setpre_info({name: category_name});
        seterrors({});
    }, [category_name]);


    const submit_catagory_name_change = async () => {
        seterrors({});
        const parsedData = categorySchema.safeParse({
            name: formData.name,
        });
        if(!parsedData.success){
            parsedData.error.issues.forEach((err: z.ZodIssue) => {
            const key = err.path[0] as string;
                seterrors((prevErrors) => ({...prevErrors, [key]: err.message}));
            });
        }
        else{
            if(pre_info.name === formData.name){return;}
            try{
                const URL= `${process.env.NEXT_PUBLIC_API_URL}/restaurant/categoryName/${restaurant_id}/${formData.name}`;
                const checkResponse = await axios.get(URL,{withCredentials: true});
                if(checkResponse.status === 200){
                    seterrors({ name: "A category with this name already exists." });
                    return;
                }
            } catch (error) {
                try {
                const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/category/${restaurant_id}/${category_id}`;
                const response = await axios.patch(RQ_URL, parsedData.data, {withCredentials: true});
                if(response.status === 200){
                    setFormData({
                        name: "",
                    });
                }
                onSuccess();
                } catch (error) {
                    console.error("Error updating category:", error);
                }
            }
        }

    }






    return (
        <>
            <FormField name="name" label="Category Name" value={formData.name} onChange={handleChange} error={Errors.name}/>
            <div className="flex justify-center">
                <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition" 
                onClick={() => {submit_catagory_name_change()}}
                >   
                    Save Changes
                </button>
            </div>
        </>
    );
}