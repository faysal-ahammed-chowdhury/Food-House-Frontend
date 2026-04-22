"use client";
import axios from "axios";
import { CircleX } from "lucide-react";
import { FormEvent, useState } from "react";
import * as z from "zod";

const createRestaurantSchema = z.object({
  name: z
    .string()
    .min(1, "Name can not be empty")
    .max(45, "Name must not exceed 45 characters"),
  email: z
    .email("Email must be valid")
    .max(30, "Email must not exceed 30 characters"),
  password: z
    .string()
    .min(6, "Password must be atleast 6 characters")
    .max(32, "Password must be atmost 32 characters"),
  address: z
    .string()
    .min(1, "Address can not be empty")
    .max(100, "Address must not exceed 100 characters"),
  description: z.string().optional(),
  isOpen: z.boolean(),
  currentCommissionPercent: z
    .number()
    .min(0, "Commission Percent Should be >= 0%")
    .max(100, "Commission Percent Should be <= 100%"),
  currentDeliveryFee: z.number().min(0, "Delivery Fee Should be >= 0"),
  bkashAccount: z.string().optional(),
  bankAccount: z.string().optional(),
});

export default function AddRestaurantForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [commissionPercent, setCommissionPercent] = useState<string>("0");
  const [deliveryFee, setDeliveryFee] = useState<string>("0");
  const [bankAccount, setBankAccount] = useState<string>("");
  const [bkash, setBkash] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const result = createRestaurantSchema.safeParse({
      name,
      email,
      password,
      address,
      currentCommissionPercent: Number(commissionPercent),
      currentDeliveryFee: Number(deliveryFee),
      bkashAccount: bkash,
      bankAccount: bankAccount,
      isOpen: true,
    });

    if (!result.success) {
      console.log(result.error.format());
      const messages = result.error.issues.map((err) => err.message);
      setErrors(messages);

      return;
    }

    console.log(result.data);
    setLoading(true);
    setErrors([]);

    try {
      const res = await axios.post(
        "http://localhost:5000/admin/restaurants",
        result.data,
      );

      console.log(res.data);

      setName("");
      setEmail("");
      setPassword("");
      setAddress("");
      setDescription("");
      setCommissionPercent("0");
      setDeliveryFee("0");
      setBkash("");
      setBankAccount("");

      onSuccess();
    } catch (error: any) {
      const messages = error.response?.data?.message;

      if (Array.isArray(messages)) {
        console.log("I am here" + messages);

        setErrors(messages);
      } else {
        setErrors([messages || "Something went wrong"]);
      }
    }

    setLoading(false);

    console.log("doneee");
  };

  return (
    <div className="w-[500px] ">
      {errors.length > 0 && (
        <ul className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 space-y-2">
          {errors.map((msg, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-red-600"
            >
              <CircleX size={16} />
              <p>{msg}</p>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-1">
            Restaurant Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
          />
        </div>
        <div className="flex justify-between gap-4">
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
            />
          </div>
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
            />
          </div>
        </div>
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
          />
        </div>
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
          />
        </div>

        <div className="flex justify-between gap-4">
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
              Commission Percent
            </label>
            <input
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(e.target.value)}
              type="number"
              className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
            />
          </div>
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
              Delivery Fee
            </label>
            <input
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              type="number"
              className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
              Bkash
            </label>
            <input
              value={bkash}
              onChange={(e) => setBkash(e.target.value)}
              type="text"
              className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
            />
          </div>
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
              Bank Account
            </label>
            <input
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              type="text"
              className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
            />
          </div>
        </div>
        <div className="w-full">
          <button
            type="submit"
            className="w-full mt-5 font-bold bg-pink-500 cursor-pointer px-5 py-3 text-white rounded-lg "
          >
            {loading ? "Creating Restaurant..." : "Create Restaurant Account"}
          </button>
        </div>
      </form>
    </div>
  );
}
