"use client";

import CreateCategoryForm from "@/components/restaurants/create_catagory_form";
import EditCategoryForm from "@/components/restaurants/Edit_catagoty_form";
import MyModal from "@/components/restaurants/my-modal";
import axios from "axios";
import { Pencil } from "lucide-react";
import { use, useContext, useEffect, useState } from "react";
import ShowItemForm from "@/components/restaurants/show_items_form";
import AuthContext from "@/contexts/auth/auth-context";
import { UserRoles } from "@/enums/user-roles.enum";


export default function Menu({ params }: { params: Promise<{ restaurant_id: string }>}){
  const { restaurant_id } = use(params);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showCreateItemModal, setShowCreateItemModal] = useState(false);
  const [ShowEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const authContext = useContext(AuthContext);

  function category_modal_close() {
    setShowCreateCategoryModal(false);
  }
  function category_modal_open() {
    setShowCreateCategoryModal(true);
  }

  function item_modal_close() {
    setShowCreateItemModal(false);
  }

  function item_modal_open() {
    setShowCreateItemModal(true);
  }

  function edit_category_modal_open() {
    setShowEditCategoryModal(true);
  }

  function edit_category_modal_close() {
    setShowEditCategoryModal(false);
  }

  async function item_button_clicked(categoryId: number) {
    await setSelectedCategoryId(categoryId);
    item_modal_open();
  }

  async function edit_category_button_clicked(categoryId: number) {
    await setSelectedCategoryId(categoryId);
    edit_category_modal_open();
  }

  useEffect(() => {
    fetchCategories();
  }, [authContext?.user]);

  async function fetchCategories() {
    if (!authContext?.user) {
      return;
    }
    if(authContext.user!.role !==  UserRoles.RESTAURANT){
      return;
    }
    setCategories([]);
    try{
        const URL=`${process.env.NEXT_PUBLIC_API_URL}/restaurant/categoryCount/${restaurant_id}`;
        const response = await axios.get(URL,{withCredentials: true});
        if(response.data.categoryCount === 0){return;}
        try {
          const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/restaurantcategories/${restaurant_id}`;
          const response = await axios.get(RQ_URL,{withCredentials: true});      
          setCategories(response.data);
        } catch (error) {
          console.error(error);
        }
    } 
    catch{}
  }

  async function deleteCategory(categoryId: string) {
    if (!confirm("Are you sure you want to delete this category? All the items in this category will also be deleted.")) {
      return;
    }
    try {
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/category/${restaurant_id}/${categoryId}`;
      await axios.delete(RQ_URL,{withCredentials: true});
      alert("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("Failed to delete category. Please try again.");
    }
  }



  return (
    <>
    {/* Create Category Modal */}
    <MyModal
      title="Create New Category"
      open={showCreateCategoryModal}
      onClose={() => {
        fetchCategories();
        category_modal_close();
      }}
    >
    <CreateCategoryForm 
      restaurant_id={restaurant_id}
      onSuccess={() => {
        alert("Category created successfully!");
        fetchCategories();
        category_modal_close();
      }}
    />
    </MyModal>

    {/* Edit Category Modal */}
    <MyModal
      title="Category Name Change"
      open={ShowEditCategoryModal}
      onClose={edit_category_modal_close}
    >
    <EditCategoryForm 
      restaurant_id={restaurant_id}
      category_id={selectedCategoryId}
      category_name={categories.find(cat => cat.categoryId === selectedCategoryId)?.name || ""}
      onSuccess={() => {
        alert("Category name changed!");
        fetchCategories();
        edit_category_modal_close();
      }}
    />
    </MyModal>

    {/* Show Items Modal */}
    <MyModal
      title={categories.find(cat => cat.categoryId === selectedCategoryId)?.name + " - Section"|| "Items"}
      open={showCreateItemModal}
      onClose={() => {
        fetchCategories();
        item_modal_close();
      }}
    >
    <ShowItemForm 
      restaurant_id={restaurant_id}
      category_id={selectedCategoryId}
      onSuccess={() => {
        alert("Item created successfully!");
        fetchCategories();
        item_modal_close();
      }}
    />
    </MyModal>    
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Menu</h1>
          <p className="text-slate-500 mt-1">Manage your restaurant's menu items</p>
        </div>
        <button type="button"
          className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg bg-pink-600 hover:bg-pink-700"
          onClick={category_modal_open}
        >+ Add new Category</button>
      </header>

      <div className="space-y-8"> 
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
            <div
                key={category.categoryId}
                className="relative h-52 rounded-2xl overflow-hidden group shadow-lg"
              >
                <img
                  src={process.env.NEXT_PUBLIC_API_URL + "/restaurant/catagoryImage/" + category.categoryId}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                      
              <div className="absolute inset-0 bg-black/45" />      
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex justify-center items-center flex-1">
                  <h2 className="text-white text-2xl font-bold text-center drop-shadow-lg">
                    {category.name}
                  </h2>
                </div>
            
                <div className="flex gap-2">
                  <button className="relative group px-2 py-1 bg-black-600 hover:bg-black-500 text-white font-medium rounded-lg transition-all"
                    onClick={() => edit_category_button_clicked(category.categoryId)}
                  >
                    <Pencil size={12} className="text-white" />
                  </button>
                  <button
                    onClick={() => item_button_clicked(category.categoryId)}
                    className="flex-1 bg-white/20 backdrop-blur-md text-white border border-white/30 py-2 rounded-xl font-semibold hover:bg-white/30 transition"
                  >
                    Items
                  </button>
                          
                  <button
                    onClick={() => deleteCategory(category.categoryId)}
                    className="flex-1 bg-red-500/80 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
                </div>
              </div>
            ))}
          </div>
          {categories.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-medium">
              No categories found. Please add a category to get started.
            </div>
          )}
      </div>
    </>
  );
}