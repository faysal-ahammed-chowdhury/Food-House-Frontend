"use client";

import { FormField } from "@/components/restaurants/form_field";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";

const itemSchema = z.object({
    name: z.string().min(1, "Item name is required"),
    description: z.string().optional(),
    price: z.number().min(1, "Price must be a positive number"),
    imageUrl: z.string().optional(),
    isAvailable: z.boolean(),
    preparationTime: z.number().min(1, "Preparation time must be a positive number"),
    categoryId: z.number(),
    restaurantId: z.number()
});

export default function CreateItemForm({restaurant_id, category_id, onSuccess} : {restaurant_id: string, category_id: number, onSuccess: () => void}) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        isAvailable: true,
        preparationTime: "",
        categoryId: category_id,
        restaurantId: restaurant_id
    });
    const [Errors, seterrors] = useState<Record<string, string>>({});
    const [items, setItems] = useState<any[]>([]);


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



    async function fetchItems() {
        setItems([]);
        if(category_id === 0) return;

        try {
            const item_count= await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/items/count/${category_id}`);
            console.log(item_count.data);
            if(item_count.data==0){return;}
            try{
                 const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/items/${restaurant_id}/${category_id}`;
                const response = await axios.get(RQ_URL);        
                console.log(response.data);       
                setItems(response.data);
            }catch(error){
                console.error(error);
            }
           
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        fetchItems();
    }, [category_id],);

    async function deleteItem(itemId: number) {
        if (!confirm("Are you sure you want to delete this item?")) {
          return;
        }
        try{
            const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/items/${itemId}`;
            await axios.delete(RQ_URL);
            alert("Item deleted successfully!");
            fetchItems();
        } catch (error) {
            console.error(error);
            alert("Error deleting item.");
        }
    }


    return (
        <>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Description</th>
                    <th className="border border-gray-300 p-2">Price</th>
                    <th className="border border-gray-300 p-2">Image</th>
                    <th className="border border-gray-300 p-2">Available</th>
                    <th className="border border-gray-300 p-1">
                        Preparation Time
                    </th>
                    <th className="border border-gray-300 p-1">
                        Edit/Remove
                    </th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item, index) => (
                    <tr key={index} className="text-center">
                        <td className="border border-gray-300 p-2">
                        {item.name}
                        </td>

                        <td className="border border-gray-300 p-2">
                        {item.description}
                        </td>

                        <td className="border border-gray-300 p-2">
                        <b>৳</b>{item.price}
                        </td>

                        <td className="border border-gray-300 p-2">
                        <img
                            src={process.env.NEXT_PUBLIC_API_URL + "/restaurant/items/" +item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover mx-auto rounded"
                        />
                        </td>

                        <td className="border border-gray-300 p-2">
                        {item.isAvailable ? "Yes" : "No"}
                        </td>

                        <td className="border border-gray-300 p-1">
                        {item.preparationTime} min
                        </td>
                        <td className="border border-gray-300 p-1">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600 transition">
                            Edit
                        </button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                            onClick={() => deleteItem(item.itemId)}
                        >
                            Remove
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
        </>
    );
}
    