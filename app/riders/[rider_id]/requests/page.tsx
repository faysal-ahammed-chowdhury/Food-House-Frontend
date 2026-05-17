"use client";


import { use, useEffect, useState } from "react";
import axios from "axios";

export default function DeliveryRequests({ params }: { params: Promise<{ rider_id: string }> }) {
  const { rider_id } = use(params);
  const [isOnline, setIsOnline] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  
  async function fetchStatus() {
    try {

      console.log("Fetching status for rider ID:", rider_id);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/rider/riders/${rider_id}/status`,{withCredentials: true}
      );
      if (response.status === 200) {
        setIsOnline(response.data.data.isOnline);
        //console.log("Rider status fetched successfully:", response.data.data.isOnline);
      }
    } catch (error) {
      console.error("Error fetching rider status:", error);
    }
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  //fetch available requests mane jegula ready 
  async function fetchAvailableRequests() {
    try {
      setLoadingRequests(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/rider/available`,{withCredentials: true}
      );

      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  }

  useEffect(() => {
    if (isOnline) {
      fetchAvailableRequests();
    }
  }, [isOnline]);

  async function handleAcceptDelivery(orderId: number) {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/rider/accept`, {
        orderId,
        riderId: rider_id,
      },{withCredentials: true}
    );
      // After accepting remv the accepted order from the list
      setRequests((prev) => prev.filter((req: any) => req.orderId !== orderId));
     
    } catch (error) {
      console.error("Error accepting delivery:", error);
    }
  }

  return (
    
      <div className="flex flex-1">
        
        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Title  */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800">Delivery Requests</h1>
                <p className="text-gray-500 font-medium mt-1">Available orders waiting for a rider</p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-pink-50/50 border border-pink-100 rounded-[2.5rem] min-h-[500px] p-8">
              {!isOnline ? (
                /* Offline State */
                <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
                  
                  <h2 className="text-3xl font-black text-slate-800 mb-3">You are Offline</h2>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8">
                    Go online to see and accept delivery requests.
                  </p>
                  
                </div>
              ) : (
                /* Online State (Placeholder for orders) */
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500"> 
                  

                    {loadingRequests ? (
                      <p className="text-gray-500">Loading requests...</p>
                    ) : requests.length === 0 ? (
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-700">No requests available</h3>
                        <p className="text-slate-400 mt-2">Wait for new orders...</p>
                      </div>
                    ) : (
                      <div className="w-full overflow-x-auto">
                        <table className="w-full bg-white rounded-2xl shadow border overflow-hidden">
                          
                          {/* Table Header */}
                          <thead className="bg-slate-100 text-slate-700 text-sm">
                            <tr>
                              <th className="p-4 text-left">Order</th>
                              <th className="p-4 text-left">Restaurant → Customer</th>
                              <th className="p-4 text-left">Pickup</th>
                              <th className="p-4 text-left">Drop</th>
                              <th className="p-4 text-left">Earn</th>
                              <th className="p-4 text-left">Time</th>
                              <th className="p-4 text-left">Payment</th>
                              <th className="p-4 text-center">Actions</th>
                            </tr>
                          </thead>

                          {/* Table Body */}
                          <tbody>
                            {requests.map((req: any) => (
                              <tr key={req.orderId} className="border-t hover:bg-slate-50">
                                
                                <td className="p-4 font-semibold">
                                  #{req.orderId}
                                </td>

                                <td className="p-4 text-sm text-gray-600">
                                  {req.restaurantName} → {req.customerName}
                                </td>

                                <td className="p-4 text-sm">
                                  {req.restaurantAddress}
                                </td>

                                <td className="p-4 text-sm">
                                  {req.customerAddress}
                                </td>

                                <td className="p-4 font-semibold text-green-600">
                                  ৳{req.deliveryFee}
                                </td>

                                <td className="p-4 text-sm text-gray-500">
                                  {req.estimatedDeliveryTime} min
                                </td>

                                <td className="p-4 text-sm">
                                  {req.paymentMethod}
                                </td>

                                <td className="p-4 text-center">
                                  <div className="flex justify-center gap-2">
                                    <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm" onClick={() => handleAcceptDelivery(req.orderId)}>
                                      Accept
                                    </button>
                                  </div>
                                </td>

                              </tr>
                            ))}
                          </tbody>

                        </table>
                      </div>
                    )}

                </div>
              )}
            </div>

          </div>
        </main>
      </div>

     
   
  );
}