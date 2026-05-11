"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import z from "zod";
import { FormField } from "./form_field";
import { Camera } from "lucide-react";

const itemSchema = z.object({
    description: z.string().max(200),
    price: z.number().min(1, "Price must be at least 1 tk"),
    preparationTime: z.number().min(1, "Preparation time must be at least 1 minute"),
});


export default function EditItemForm({itemId,  onSuccess} : {itemId: number, onSuccess: () => void}) {
    const [formData, setFormData] = useState({
        description: "",
        price: 0,
        preparationTime: 0,
        imageUrl: ""
    });
    const [OnDataBase, setOnDataBase] = useState({
        description: "",
        price: 0,
        preparationTime: 0,
        imageUrl: ""
    });

    const [Errors, seterrors] = useState<Record<string, string>>({});

    const [change_made, setChange_made] = useState(false);

    async function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setChange_made(true);
        await setFormData(prev => ({ ...prev, [name]: value }));
        if (Errors[name]) {
            seterrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

    };

    useEffect(() => {
        fetchItemDetails();
    }, [itemId]);

    async function fetchItemDetails() {
        if(itemId === 0) return;
        setChange_made(false);
        setFormData({
            description: "",
            price: 0,
            preparationTime: 0,
            imageUrl: ""
        });

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/item/${itemId}`, {withCredentials: true});
            const item = response.data;
            setFormData({
                description: item.description,
                price: item.price,
                preparationTime: item.preparationTime,
                imageUrl: item.imageUrl
            });
            setOnDataBase({
                description: item.description,
                price: item.price,
                preparationTime: item.preparationTime,
                imageUrl: item.imageUrl
            });
        } catch (error) {
            setChange_made(true);
            console.error(error);
        }
    }

    async function validateAndSubmit(e: React.FormEvent) {
        e.preventDefault();
        if(formData.description === OnDataBase.description && 
            formData.price === OnDataBase.price &&
            formData.preparationTime === OnDataBase.preparationTime){
            return;
        }
        const validation = itemSchema.safeParse({
            description: formData.description,
            price: Number(formData.price),
            preparationTime: Number(formData.preparationTime)
        });
        if (!validation.success) {
            const fieldErrors: Record<string, string> = {};
            validation.error.issues.forEach(issue => {
                if (issue.path.length > 0) {
                    const fieldName = String(issue.path[0]);
                    fieldErrors[fieldName] = issue.message;
                }
            });
            seterrors(fieldErrors);
            return;
        }
        try {    
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/items/${itemId}`, {
                description: formData.description,
                price: Number(formData.price),
                preparationTime: Number(formData.preparationTime)
            }, {withCredentials: true});
            setChange_made(false);
            onSuccess();
        } catch (error) {
            console.error(error);
        }
    }


    const handleImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if ("imageUrl" in Errors) {
      seterrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.imageUrl;
        return newErrors;
      });
    }
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024){
      seterrors(prev => ({ ...prev, imageUrl: "File size must be less than 2MB" }));
      return;
    } 
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/items/${itemId}`;
    const uploadData = new FormData();
    uploadData.append('myfile', file);

    const localPreview = window.URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, imageUrl: localPreview }));

    try {
      const response = await axios.put(URL, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
        , withCredentials: true
      });
      if (response.data.imageUrl) {
        setFormData(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
        setOnDataBase(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
      }
      alert("Image updated successfully!");
    } catch (error) {
      alert("Something went wrong. Failed to upload image");
    }
  };

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-10 border-b border-slate-100">
                    <img 
                      src={process.env.NEXT_PUBLIC_API_URL + "/restaurant/getimage/" + formData.imageUrl} 
                      className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md flex-shrink-0" 
                      alt="profile" 
                    />
                    <div className="flex flex-col items-center sm:items-start gap-4">   

                      <label className="cursor-pointer flex flex-row items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95 w-max">
                        <Camera size={16} />
                        <span>Update Photo</span>
                        <input type="file"  id="photo-upload" className="hidden" accept=".jpg, .jpeg, .png, .webp" onChange={handleImageUpdate}/>
                      </label>
                        {Errors.imageUrl && (
                          <span className="text-red-500 text-sm mt-1">
                            {Errors.imageUrl}
                        </span>
                       )}
                    </div>
                  </div>

            <form 
                onSubmit={validateAndSubmit}
            >
                <FormField 
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    error={Errors.description}
                />
                <FormField 
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    error={Errors.price}
                />
                <FormField 
                    label="Preparation Time"
                    name="preparationTime"
                    type="number"
                    value={formData.preparationTime}
                    onChange={handleChange}
                    error={Errors.preparationTime}
                />
                <br></br>
                <div className="flex justify-center">
                    {change_made && <p className="text-yellow-600 mb-2">You have unsaved changes.</p>}
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 transition">
                        Save Changes
                    </button>
                </div>
            </form>
        </>
    );

}