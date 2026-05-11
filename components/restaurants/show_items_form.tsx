"use client";

import axios from "axios";
import { ArrowLeftRight } from "lucide-react";
import { useEffect, useState } from "react";
import MyModal from "./my-modal";
import CreateNewItemForm from "./create_new_items_form";

export default function ShowItemForm({restaurant_id, category_id, onSuccess} : {restaurant_id: string, category_id: number, onSuccess: () => void}) {
    const [items, setItems] = useState<any[]>([]);
    const [showCreateNewItemModal, setShowCreateNewItemModal] = useState(false);

    function item_modal_close() {
        setShowCreateNewItemModal(false);
    }

    function item_modal_open() {
        setShowCreateNewItemModal(true);
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

    async function toggleAvailability(itemId: number, currentStatus: boolean) {
        try {
            const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/items/${itemId}`;
            await axios.put(RQ_URL, { isAvailable: !currentStatus });
            setItems(prev => prev.map(item => 
                item.itemId === itemId ? {...item, isAvailable: !currentStatus} : item
            ));
        } catch (error) {
            console.error(error);
            alert("Error updating item availability.");
        }
    }




    return (
        <>
            <MyModal
                  title="Add New Item"
                  open={showCreateNewItemModal}
                  onClose={item_modal_close}
                >
                <CreateNewItemForm 
                  restaurant_id={restaurant_id}
                  category_id={category_id}
                  onSuccess={() => {
                    alert("Item created successfully!");
                    fetchItems();
                    item_modal_close();
                  }}
                />
            </MyModal>



            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all"
                onClick={item_modal_open}
            >
                + Add New Item
            </button>

            <br></br><br></br>
            {items.length > 0 ? 
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
                        <button className={`ml-2 px-2 py-1 rounded ${item.isAvailable ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white transition`}
                            onClick={() => toggleAvailability(item.itemId, item.isAvailable)}
                        ><ArrowLeftRight size={13} />
                        
                        </button>
                        </td>

                        <td className="border border-gray-300 p-1">
                        {item.preparationTime} min
                        </td>
                        <td className="border border-gray-300 p-1">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600 transition"
                            // onClick={() => alert("Edit functionality coming soon!")}
                        >
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
                :"No items in this category yet."
            }
        </>
    );
}
    