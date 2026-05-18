import CartClient from "@/components/customer/cart-client";

export const metadata = {
  title: "Cart | FoodHouse",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl xl:mx-auto w-full px-8 py-10">
        <CartClient />
      </main>
    </div>
  );
}
