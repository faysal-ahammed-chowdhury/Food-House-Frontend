"use client";

import { FormField } from "@/components/restaurants/form_field";
import axios from "axios";
import { ArrowLeftRight, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

const itemSchema = z.object({
    name: z.string().min(1, "Item name is required"),
    description: z.string().optional(),
    price: z.number().min(1, "Price must be a positive number"),
    isAvailable: z.boolean(),
    preparationTime: z.number().min(1, "Preparation time must be a positive number"),
    categoryId: z.number(),
    restaurantId: z.number()
});




export default function CreateNewItemForm({restaurant_id, category_id, onSuccess} : {restaurant_id: string, category_id: number, onSuccess: () => void}) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        isAvailable: true,
        preparationTime: 0,
        categoryId: category_id,
        restaurantId: Number(restaurant_id)
    });
    const [Errors, seterrors] = useState<Record<string, string>>({});
    const [file, setFile] = useState<File | null>(null);

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

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFile(null);
        if ("myfile" in Errors) {
        seterrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.myfile;
            return newErrors;
        });
        }
        const selectedFile = e.target.files?.[0];
        if(!selectedFile)return;
        if(selectedFile.size > 2 * 1024 * 1024){
            console.log("File size exceeds 2MB");
            seterrors(prev => ({...prev, myfile: "File size must be less than 2MB"}));
            setFile(null);
            return;
        }
        setFile(selectedFile);
    }

    useEffect(() => {
        setFormData({
            name: "",
            description: "",
            price: 0,
            isAvailable: true,
            preparationTime: 0,
            categoryId: category_id,
            restaurantId: Number(restaurant_id)
        });
        seterrors({});
        setFile(null);
    }, [category_id, restaurant_id]);



    async function AddItem(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const currentErrors = { ...Errors };
        ["name", "description", "price", "preparationTime"].forEach(field => delete currentErrors[field]);

        formData.categoryId = category_id;
        formData.price = Number(formData.price);
        formData.preparationTime = Number(formData.preparationTime);
        
        const result = itemSchema.safeParse(formData);
        
        if(!result.success){
            result.error.issues.forEach((err: z.ZodIssue) => {
                const key = err.path[0] as string;
                if (!currentErrors[key]) {
                    currentErrors[key] = err.message; 
                }
            });
            seterrors(currentErrors);
            return;
        }
        if(file===null){return;}
        else{
            try {
                const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/createItems`;
                const response = await axios.post(RQ_URL, formData);
                setFormData({
                    name: "",
                    description: "",
                    price: 0,
                    isAvailable: true,
                    preparationTime: 0,
                    categoryId: category_id,
                    restaurantId: Number(restaurant_id)
                });
                console.log(response.data.itemId);
                if(file){
                    const URL= `${process.env.NEXT_PUBLIC_API_URL}/restaurant/items/${response.data.itemId}`;
                    const formData = new FormData();
                    formData.append("myfile", file);
                    console.log(formData);

                    try {
                        await axios.put(URL, formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        });
                    } catch (error) {
                        console.error("Error uploading image:", error);
                    }
                }
                onSuccess();
            } catch (error) {
                console.error("Error adding item:", error);
            }
        }
    }
    


    return (
    <>  
        <form onSubmit={AddItem}>
            <FormField label="Item Name" name="name" value={formData.name} onChange={handleChange} error={Errors.name} />  <br></br>
            <FormField label="Description" name="description" type="textarea" value={formData.description} onChange={handleChange} error={Errors.description} /> <br></br>
            <FormField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} error={Errors.price} />  <br></br>
            <label className="cursor-pointer flex flex-row items-center gap-2 px-3 py-2 bg-white text-slate-700 rounded-sm text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95 w-max">
                <Camera size={22} />
                <input type="file"  id="photo-upload" name="myfile"  accept=".jpg, .jpeg, .png, .webp" onChange={handleImageChange} />
            </label> 
            {Errors.myfile && <p className="text-red-500 text-xs mt-1"><b>{Errors.myfile}</b></p>}<br></br>  

            <FormField label="Preparation Time (minutes)" name="preparationTime" type="number" value={formData.preparationTime} onChange={handleChange} error={Errors.preparationTime} />
                <br></br>
            <button className="bg-blue-500 text-white text-lg font-bold px-30 py-2 rounded hover:bg-blue-600 transition"
             >
             ADD ITEM
            </button>
        </form>
    </>
    );
}