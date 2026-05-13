import axios from "axios";
import { Activity, CheckCircle, CircleDollarSign, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { cookies } from "next/headers";


export default async function Dashboard({ params }: { params: Promise<{ restaurant_id: string }> }) {
  const { restaurant_id } = await params;
  async function active_order_count(restaurant_id: string){
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
        
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/financialInfo/${restaurant_id}`;
      const response = await axios.get(RQ_URL, {
        headers: { Cookie: cookieHeader },
        withCredentials: true,
      });
      return response.data.completedCount;
    } catch {
      return 0;
    }
  }
  const activeOrders= await active_order_count(restaurant_id);

  async function pending_orders_count(restaurant_id: string){
    try{
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
        
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/financialInfo/${restaurant_id}`;
      const response = await axios.get(RQ_URL, {
        headers: { Cookie: cookieHeader },
        withCredentials: true,
      });
      return response.data.pendingCount;
    } catch {
      return 0;
    }
  }
  const prendingOrdes= await pending_orders_count(restaurant_id);

  async function total_revenue_count(restaurant_id: string){
    try{
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
        
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/financialInfo/${restaurant_id}`;
      const response = await axios.get(RQ_URL, {
        headers: { Cookie: cookieHeader },
        withCredentials: true,
      });
      return response.data.totalRevenue;
    } catch {
      return 0;
    }
  }
  const totalRevenue= await total_revenue_count(restaurant_id);

  async function total_commission_count(restaurant_id: string){
    try{
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
        
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/financialInfo/${restaurant_id}`;
      const response = await axios.get(RQ_URL, {
        headers: { Cookie: cookieHeader },
        withCredentials: true,
      });
      return response.data.totalCommission;
    } catch {
      return 0;
    }
  }
  const totalCommission= await total_commission_count(restaurant_id);

  async function MenuCount(restaurant_id: string){
    try{
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
        
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/itemsCount/${restaurant_id}`;
      const response = await axios.get(RQ_URL, {
        headers: { Cookie: cookieHeader },
        withCredentials: true,
      });
      return response.data;
    } catch {
      return 0;
    }
  }
  const menuItems_count = await MenuCount(restaurant_id);

  async function status_on_off(restaurant_id: string){
    try{
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
        
      const RQ_URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/restaurants/${restaurant_id}`;
      const response = await axios.get(RQ_URL, {
        headers: { Cookie: cookieHeader },
        withCredentials: true,
      });
      return response.data.data.isOpen;
    } catch {
      return 0;
    }
  }
  const RES_status = await status_on_off(restaurant_id);




  return (
    <>
     <div className="p-8 bg-slate-50 min-h-screen">
      <div className="grid grid-cols-6 gap-6 max-w-6xl mx-auto">
        
        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4 text-pink-500"><ShoppingBag size={24} strokeWidth={2.5} /></div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">{prendingOrdes}</h3>
            <p className="text-sm font-medium text-slate-500">Pending Orders</p>
          </div>
        </div>

        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4 text-emerald-500"><CheckCircle size={24} strokeWidth={2.5} /></div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">{activeOrders}</h3>
            <p className="text-sm font-medium text-slate-500">Completed Orders</p>
          </div>
        </div>

        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4 text-pink-500"><CircleDollarSign size={24} strokeWidth={2.5} /></div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">৳{totalRevenue.toFixed(2) - totalCommission.toFixed(2)}</h3>
            <p className="text-sm font-medium text-slate-500">Net Earnings</p>
          </div>
        </div>
      </div>
        
        <br></br><br></br><br></br>
      
      <div className="grid grid-cols-6 gap-16 max-w-4xl mx-auto">
        <div className="col-span-3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4 text-pink-500"><UtensilsCrossed size={24} strokeWidth={2.5} /></div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">{menuItems_count}</h3>
            <p className="text-sm font-medium text-slate-500">Menu Items</p>
          </div>
        </div>

        <div className="col-span-3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4 text-blue-500"><Activity  size={24} strokeWidth={2.5} /></div>
          <div className="space-y-1">
          
            <div className="flex items-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold tracking-wide transition-colors duration-300 ${
                RES_status 
                  ? 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20' 
                  : 'bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/20'
                }`}>
                {RES_status ? 'Open' : 'Close'}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">Status</p>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}