"use client";

import { useState, use, useEffect, useContext } from "react";
import { boolean, set, z } from "zod";
import { 
  Mail, Store, Info, 
  MapPin, CreditCard, Smartphone, Save, Lock, 
  Camera
} from 'lucide-react';
import { FormField } from "@/components/restaurants/form_field";
import axios from "axios";
import MyModal from "@/components/restaurants/my-modal";
import ProfileUpdateForm from "@/components/restaurants/profile_update_form";
import PasswordUpdateForm from "@/components/restaurants/password_update_form";
import { UserRoles } from "@/enums/user-roles.enum";
import AuthContext from "@/contexts/auth/auth-context";



const profileSchema = z.object({
  name: z.string()
    .nonempty("Name is required.")
    .max(45, "Max 45 characters allowed."),
  
  email: z.string()
    .nonempty("Email is required.")
    .email("Invalid email format.")
    .max(30, "Max 30 characters allowed."),
  
  bannerUrl: z.string().optional(),

  description: z.string()
    .max(100, "Max 100 characters allowed.")
    .optional(),

  address: z.string()
    .nonempty("Address is required.")
    .max(100, "Max 100 characters allowed."),
    
  bkashAccount: z.string().superRefine((val, ctx) =>{
    if (val==="") return;
    if (!/^(?:\+88)?01[0-9]{9}$/.test(val)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid phone number." });
    }
  }),
  
  bankAccount: z.string().superRefine((val, ctx) => {
    if (val === "") return;
    if (!/^\d+$/.test(val)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must be numeric." });
    } else if (val.length < 10) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Minimum 10 digits required." });
    }
  })
});


const passwordSchema = z.object({
  newPassword: z.string()
    .min(6, "Password must be at least 6 characters."),

  confirmPassword: z.string() 
}).refine((data) =>
    data.newPassword === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match."
});


export default function Profile({ params }: { params: Promise<{ restaurant_id: string }>}){
  const authContext = useContext(AuthContext);
  const [ShowProfileUpdateModal, setShowProfileUpdateModal] = useState(false);
  const [ShowPasswordUpdateModal, setShowPasswordUpdateModal] = useState(false);
  const { restaurant_id } = use(params);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    description: "",
    address: "",
    bankAccount: "",
    bkashAccount: "",
    newPassword: "",
    confirmPassword: "",
    bannerUrl: "",
    isOpen: false,
  });


  const [OnDB, setOnDB] = useState({
    email: "",
    name: "",
    description: "",
    address: "",
    bankAccount: "",
    bkashAccount: "",
    newPassword: "",
    confirmPassword: "",
    bannerUrl: "",
    isOpen: false,
  });
  

  useEffect(() => {
    fetchData();
  }, [authContext?.user]);

  async function fetchData() {
    if (!authContext?.user) {
      return;
    }
    if(authContext.user!.role !==  UserRoles.RESTAURANT){
      return;
    }

     try {
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/restaurants/${restaurant_id}`;
      const response = await axios.get(RQ_URL,{withCredentials: true});
      console.log(response.data.data);
      if(response.data.success){
        const jsonData = response.data.data;

        setOnDB((prev) => ({
          ...prev,
          name: jsonData.user.name || "",
          email: jsonData.user?.email || "",
          description: jsonData.description || "",
          address: jsonData.address || "",
          bankAccount: jsonData.bankAccount || "",
          bkashAccount: jsonData.bkashAccount || "",
          bannerUrl: jsonData.bannerUrl || "",
          isOpen: jsonData.isOpen || false,
        }));
        
        setFormData((prev) => ({
          ...prev,
          name: jsonData.user.name || "",
          email: jsonData.user?.email || "",
          description: jsonData.description || "",
          address: jsonData.address || "",
          bankAccount: jsonData.bankAccount || "",
          bkashAccount: jsonData.bkashAccount || "",
          bannerUrl: jsonData.bannerUrl || "",
          isOpen: jsonData.isOpen || false,
        }));        
      }
      
    } 
    catch (error) {
      console.error(error);
    }
  }

  const handleToggle = async () => {
    const toggledValue= !formData.isOpen;
    const statusText = toggledValue ? "open" : "closed";
    const URL= `${process.env.NEXT_PUBLIC_API_URL}/restaurant/updateStatus/${restaurant_id}/${statusText}`;
    setFormData(prev => ({ ...prev, isOpen: toggledValue }));
    try{
      const response = await axios.patch(URL,{withCredentials: true});
    }
    catch(error){
      // console.error(error);
      alert("Failed to update shop status. Please try again.");
    }
  }

  const [change_MESSAGE, setChange_MESSAGE] = useState("");

  const CHANGE_MESSAGE = async () => {
    setChange_MESSAGE("");
    let anyChange = false;
    if(OnDB.email !== formData.email){
      if(anyChange===false){
        anyChange=true;
        setChange_MESSAGE("Changes detected in---> ");
      }
      else{
          setChange_MESSAGE(prev => prev + ", ");
      }
      setChange_MESSAGE(prev => prev + "Business Email");
    }

      if(OnDB.name !== formData.name){
        if(anyChange===false){
          anyChange=true;
          setChange_MESSAGE("Changes detected in---> ");
        } 
        else{
          setChange_MESSAGE(prev => prev + ", ");
        }
        setChange_MESSAGE(prev => prev + "Restaurant Name");
      }

      if(OnDB.description !== formData.description){
        if(anyChange===false){
          anyChange=true;
          setChange_MESSAGE("Changes detected in---> ");
        } 
        else{
          setChange_MESSAGE(prev => prev + ", ");
        }
        setChange_MESSAGE(prev => prev + " Description");
      }

      if(OnDB.address !== formData.address){
        if(anyChange===false){
          anyChange=true;
          setChange_MESSAGE("Changes detected in---> ");
        } 
        else{
          setChange_MESSAGE(prev => prev + ", ");
        }
        setChange_MESSAGE(prev => prev + "Address");
      }

      if(OnDB.bankAccount !== formData.bankAccount){
        if(anyChange===false){
          anyChange=true;
          setChange_MESSAGE("Changes detected in---> ");
        } 
        else{
          setChange_MESSAGE(prev => prev + ", ");
        }
        setChange_MESSAGE(prev => prev + "Bank Account");
      }

      if(OnDB.bkashAccount !== formData.bkashAccount){
        if(anyChange===false){
          anyChange=true;
          setChange_MESSAGE("Changes detected in---> ");
        } 
        else{
          setChange_MESSAGE(prev => prev + ", ");
        }
        setChange_MESSAGE(prev => prev + "Bkash Account");
      }
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


  const handleImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if ("bannerUrl" in errors) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.bannerUrl;
        return newErrors;
      });
    }
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024){
      setErrors(prev => ({ ...prev, bannerUrl: "File size must be less than 2MB" }));
      return;
    } 
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/restaurants/${restaurant_id}`;
    const uploadData = new FormData();
    uploadData.append('myfile', file);

    const localPreview = window.URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, bannerUrl: localPreview }));

    try {
      const response = await axios.put(URL, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      if (response.data.data.bannerUrl) {
        setFormData(prev => ({ ...prev, bannerUrl: response.data.data.bannerUrl }));
        setOnDB(prev => ({ ...prev, bannerUrl: response.data.data.bannerUrl }));
      }
      alert("Image updated successfully!");
    } catch (error) {
      alert("Something went wrong. Failed to upload image");
    }
  };


  const handleEmail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if(value !== OnDB.email){
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/checkEmail?email=${e.target.value}`;
      const response = await axios.get(RQ_URL,{withCredentials: true});
      if(response.data.exists===true){
        setErrors(prev => ({ ...prev, email: "This email is already in use in another account." }));
      }
    }
  }
  

  useEffect(() => {
    CHANGE_MESSAGE();
  }, [handleChange, handleEmail]);


  const profile_modal_open = () => {
    setShowProfileUpdateModal(true);
  }

  const profile_modal_close = () => {
    setShowProfileUpdateModal(false);
  };

  const passsword_modal_open = () => {
    setShowPasswordUpdateModal(true);
  }

  const password_modal_close = () => {
    setShowPasswordUpdateModal(false);
  }


  const validateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentErrors = { ...errors };
    const profileFields = ["name", "email", "bannerUrl", "description", "address", "bkashAccount", "bankAccount"];
    profileFields.forEach(field => delete currentErrors[field]);

    const result = profileSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((err: z.ZodIssue) => {
        const key = err.path[0] as string;
        if (!currentErrors[key]) {
          currentErrors[key] = err.message; 
        }
      });
      setErrors(currentErrors);
    } else {
      if(change_MESSAGE!=="")profile_modal_open();
    }
  };

  

  const validatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentErrors = { ...errors };
    ["newPassword", "confirmPassword"].forEach(field => delete currentErrors[field]);

    const result = passwordSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((err: z.ZodIssue) => {
        const key = err.path[0] as string;
        if (!currentErrors[key]) {
          currentErrors[key] = err.message;
        }
      });
      setErrors(currentErrors);
    } 
    else {
      const URL= `${process.env.NEXT_PUBLIC_API_URL}/restaurant/matchPassword`;
      const payload = {
        restaurantId: Number(restaurant_id),
        password: formData.newPassword
      };
      const response = await axios.post(URL, payload, {withCredentials: true});  
      // console.log(response.data.match);
      if(response.data.match===true){
          setErrors((prevErrors) => ({
             ...prevErrors,
            newPassword: "New password cannot be the same as old password."
          }));
      }
      else{
        passsword_modal_open();
      }
    }
  };
 

  return (
    <>
    <div className="bg-white">
    <MyModal
        title="Confirm Password to Update Profile"
        open={ShowProfileUpdateModal}
        onClose={profile_modal_close}
    >
        <ProfileUpdateForm 
          IsSHOWN={ShowProfileUpdateModal}
          formData ={formData} 
          OnDB = {OnDB}
          restaurant_id={restaurant_id}
          onSuccess={() => {
            fetchData();
            profile_modal_close();
          }}
        />
    </MyModal>

    <MyModal
        title="Confirm Password to Update Password"
        open={ShowPasswordUpdateModal}
        onClose={password_modal_close}
    >
        <PasswordUpdateForm 
          IsSHOWN={ShowPasswordUpdateModal}
          password={formData.newPassword}
          restaurant_id={restaurant_id}
          onSuccess={() => {
            fetchData();
            password_modal_close();
            setFormData(prev => ({ ...prev, newPassword: "", confirmPassword: "" }));
          }}
          
        />
    </MyModal>
   
        <div className="bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Restaurant Profile</h1>
                <p className="text-slate-500 mt-1">Manage your shop details and operational status</p>
              </div>
              <button type="button"
                onClick={handleToggle}
                className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg"
                style={{
                  backgroundColor: !formData.isOpen ? "#16a34a" : "#dc2626",
                  boxShadow: !formData.isOpen ? "0 10px 15px -3px rgba(134, 239, 172, 0.6)" : "0 10px 15px -3px rgba(252, 165, 165, 0.6)",
                }}
              >
                {formData.isOpen ? "Close Shop" : "Open Shop"}
              </button>
            </header>

            <div className="space-y-8">
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-10 border-b border-slate-100">
                      <img 
                      src={process.env.NEXT_PUBLIC_API_URL + "/restaurant/getimage/" + formData.bannerUrl} 
                      className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md flex-shrink-0" 
                      alt="profile" 
                    />
                    <div className="flex flex-col items-center sm:items-start gap-4">
                      <span className={`px-4 py-1 rounded-full text-xs font-bold border uppercase w-max ${formData.isOpen ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        {formData.isOpen ? 'Online' : 'Currently Closed'}
                      </span>
    
                      <label className="cursor-pointer flex flex-row items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95 w-max">
                        <Camera size={16} />
                        <span>Update Photo</span>
                        <input type="file"  id="photo-upload" className="hidden" accept=".jpg, .jpeg, .png, .webp" onChange={handleImageUpdate}/>
                      </label>
                        {errors.bannerUrl && (
                          <span className="text-red-500 text-sm mt-1">
                            {errors.bannerUrl}
                          </span>
                       )}
                    </div>
                  </div>

                  <form className="space-y-6" onSubmit={validateProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Business Email" icon={Mail} name="email" value={formData.email} onChange={handleEmail} error={errors.email} />
                      <FormField label="Restaurant Name" icon={Store} name="name" value={formData.name} onChange={handleChange} error={errors.name} />
                    </div>

                    <FormField label="Restaurant Description" icon={Info} type="textarea" name="description" rows={3} value={formData.description} onChange={handleChange} error={errors.description} />
                    <FormField label="Restaurant Address" icon={MapPin} name="address" value={formData.address} onChange={handleChange} error={errors.address} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl">
                      <FormField label="Bank Account" icon={CreditCard} name="bankAccount" placeholder="0000-0000-0000" value={formData.bankAccount} onChange={handleChange} error={errors.bankAccount} />
                      <FormField label="BKash Number" icon={Smartphone} name="bkashAccount" placeholder="017XXXXXXXX" value={formData.bkashAccount} onChange={handleChange} error={errors.bkashAccount} />
                    </div>
                    { change_MESSAGE!=="" && (
                      <>
                      <span className="border border-amber-400 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-medium">
                        {change_MESSAGE}
                      </span><br /><br />
                      </>
                      
                    )}
                    
                    <button type="submit" className="w-full bg-[#f82c77] hover:bg-[#d91b61] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg active:scale-[0.98]">
                      <Save size={20} /> Update Restaurant Profile
                    </button>
                  </form>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-8">
                  <div className="p-2 bg-pink-50 rounded-lg text-[#f82c77]"><Lock size={22} /></div>
                  Security & Password
                </h2>

                <form className="space-y-6" onSubmit={validatePassword}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="New Password" type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} error={errors.newPassword} />
                    <FormField label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
                  </div>
                   <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white px-8   py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg active:scale-[0.98]">
                    Update Password
                  </button>
                </form>
              </section>
            </div>
          </div>
        </div>
  </div>
  </>
  );
}