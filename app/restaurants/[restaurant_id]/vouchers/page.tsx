"use client";

import CreateVoucherForm from "@/components/restaurants/create_voucher_form";
import Footer from "@/components/restaurants/footer";
import Header from "@/components/restaurants/header";
import MyModal from "@/components/restaurants/my-modal";
import Sidebar from "@/components/restaurants/sidebar";
import axios from "axios";
import { use, useEffect, useState } from "react";




export default function Vouchers({ params }: { params: Promise<{ restaurant_id: string }>}){
  const { restaurant_id } = use(params);
  const [displayName, setDisplayName] = useState("");
  const [vouchers, setVouchers] = useState<any[]>([]);


  useEffect(() => {
    getName();
  }, []);
  async function getName() {
     try {
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/restaurants/${restaurant_id}`;
      const response = await axios.get(RQ_URL);
      if(response.data.success){
        const jsonData = response.data.data;
        setDisplayName(jsonData.user.name);
      }
    } 
    catch (error) {
      console.error(error);
    }
  }

//   useEffect(() => {
//   console.log("Vouchers state updated to:", vouchers);
// }, [vouchers]);

  useEffect(() => {
    fetchVouchers();
  }, []);
  async function fetchVouchers() {
      try {
        const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/voucher/${restaurant_id}`;
        const response = await axios.get(RQ_URL);
        setVouchers(response.data);
        console.log(  response.data);       
      } catch (error) {
        console.error(error);
      }
  }

  async function deleteVoucher(voucherId: string) {
    const confirmed = confirm("Are you sure you want to delete this voucher?");
    if (!confirmed) return;
    try {
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/voucher/${voucherId}`;
      const response = await axios.delete(RQ_URL);
      if (response.status === 200) {
        setVouchers((prevVouchers) => prevVouchers.filter(v => v.voucherId !== voucherId));
      }
    } catch (error) {
      console.error(error);
    }
  }

  const [ShowCreateVoucherModal, setShowCreateVoucherModal] = useState(false);
  function voucher_modal_close() {
    setShowCreateVoucherModal(false);
  }
  function voucher_modal_open() {
    setShowCreateVoucherModal(true);
  }

    return (
    <>
    <MyModal
        title="Create New Voucher"
        open={ShowCreateVoucherModal}
        onClose={voucher_modal_close}
    >
      <CreateVoucherForm 
        restaurant_id={restaurant_id}
        onSuccess={() => {
        alert("Voucher created successfully!");
        fetchVouchers();
        voucher_modal_close();
      }}
      />
    </MyModal>

    <div className="bg-white">
      <Header restaurant_id={restaurant_id} name={displayName}/>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">        
        <div className="flex flex-1">
          <aside className="w-64 hidden md:block bg-white border-r border-slate-200">
            <Sidebar restaurant_id={restaurant_id} />
          </aside>
          
          <main className="flex-1 p-8 md:p-12 overflow-y-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Vouchers</h1>
                <p className="text-slate-500 mt-1">Create promotional offers for your customers</p>
              </div>
              <button type="button"
                className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg bg-pink-600 hover:bg-pink-700"
                onClick={voucher_modal_open}
              >
                + Create Voucher
              </button>
            </header>
            <div className="space-y-8">
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-black">
                {vouchers.map((voucher_info) => (
                  <div 
                    key={voucher_info.voucherId} 
                    className="card bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full overflow-hidden"
                  >
                    <figure className="bg-pink-600 p-4 text-white">
                      <div className="text-center">
                        <span className="text-2xl font-black">{voucher_info.percent}% OFF</span>
                      </div>
                    </figure>

                    <div className="card-body p-4 flex flex-col justify-between h-full gap-3">
                      <div>
                        <div className="flex text-center items-center mb-2">
                          <h2 className="text-xl font-mono font-bold text-slate-800 truncate">
                            {voucher_info.voucherCode}
                          </h2>
                        </div>

                        <div className="space-y-1 text-[12px] bg-slate-50 p-2 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Min Order Amount:</span>
                            <span className="font-bold text-slate-900">৳{voucher_info.minOrderAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Max Discount:</span>
                            <span className="font-bold text-slate-900">৳{voucher_info.maxDiscount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                        <div className="text-[9px] text-slate-400 font-medium">
                          EXP: {new Date(voucher_info.expiresAt).toLocaleDateString('en-GB')}
                        </div>
                        <button 
                          onClick={() => {deleteVoucher(voucher_info.voucherId)}}
                          className="btn btn-xs btn-primary bg-pink-600 border-none text-[10px] h-7 min-h-7"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            </div>
                         
          </main>
        </div>
        
        <Footer />
      </div>
    </div>
    </>
  );
}