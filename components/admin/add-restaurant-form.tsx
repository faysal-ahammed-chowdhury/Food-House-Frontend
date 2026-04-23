"use client";
import axios from "axios";
import { CircleX, Info } from "lucide-react";
import { FormEvent, useState } from "react";
import * as z from "zod";

export const createRestaurantSchema = z.object({
  name: z
    .string()
    .min(1, "Restaurant name is required")
    .max(100, "Max 100 characters allowed"),

  email: z
    .email("Invalid email address")
    .max(100, "Max 100 characters allowed"),

  password: z
    .string()
    .min(6, "Min 6 characters required")
    .max(32, "Max 32 characters allowed"),

  address: z
    .string()
    .min(1, "Address is required")
    .max(100, "Max 100 characters allowed"),

  description: z.string().max(500, "Max 500 characters allowed"),

  isOpen: z.preprocess((val) => val === "true" || val === true, z.boolean()),

  currentCommissionPercent: z.preprocess(
    (val) => {
      if (val === "" || val == null) return undefined;
      if (Number.isNaN(Number(val))) return undefined;
      return Number(val);
    },
    z.number("Invalid commission").min(0, "Min 0%").max(100, "Max 100%"),
  ),

  currentDeliveryFee: z.preprocess(
    (val) => {
      if (val === "" || val == null) return undefined;
      if (Number.isNaN(Number(val))) return undefined;
      return Number(val);
    },
    z.number("Invalid fee").min(0, "Cannot be negative"),
  ),

  bkashAccount: z.preprocess(
    (val) => {
      if (typeof val !== "string") return undefined;
      const v = val.trim();
      return v === "" ? undefined : v;
    },
    z
      .string()
      .regex(/^(?:\+88)?01[0-9]{9}$/, "Invalid bKash number")
      .optional(),
  ),

  bankAccount: z.preprocess((val) => {
    if (typeof val !== "string") return undefined;
    const v = val.trim();
    return v === "" ? undefined : v;
  }, z.string().min(10, "Min 10 digits").max(20, "Max 20 digits").optional()),
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
  const [commissionPercent, setCommissionPercent] = useState<string>("");
  const [deliveryFee, setDeliveryFee] = useState<string>("");
  const [bankAccount, setBankAccount] = useState<string>("");
  const [bkash, setBkash] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors({});

    const result = createRestaurantSchema.safeParse({
      name,
      email,
      password,
      address,
      description: description,
      currentCommissionPercent: commissionPercent,
      currentDeliveryFee: deliveryFee,
      bkashAccount: bkash,
      bankAccount: bankAccount,
      isOpen: true,
    });

    if (!result.success) {
      console.log(result.error.issues);

      const fieldErrors: Record<string, string[]> = {};
      result.error.issues.forEach(
        (err) => (fieldErrors[err.path[0] as string] = [err.message]),
      );
      setErrors(fieldErrors);

      return;
    }

    // console.log(result.data);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/admin/restaurants",
        result.data,
      );

      //   console.log(res.data);

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
        setErrors({ server: messages });
      } else {
        setErrors({ server: [messages || "Something went wrong"] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[500px] ">
      {errors?.server?.length > 0 && (
        <ul className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 space-y-2">
          {errors?.server.map((msg, i) => (
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
            <span>Restaurant Name</span> <span className="text-red-500">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
          />
          {errors.name && (
            <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
              <Info size={13} />
              <span>{errors.name[0]}</span>
            </p>
          )}
        </div>
        <div className="flex justify-between gap-4">
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
              <span>Email</span> <span className="text-red-500">*</span>
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
            />
            {errors.email && (
              <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
                <Info size={13} />
                <span>{errors.email[0]}</span>
              </p>
            )}
          </div>
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
              <span>Password</span> <span className="text-red-500">*</span>
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
            />
            {errors.password && (
              <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
                <Info size={13} />
                <span>{errors.password[0]}</span>
              </p>
            )}
          </div>
        </div>
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-1">
            <span>Address</span> <span className="text-red-500">*</span>
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
          />
          {errors.address && (
            <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
              <Info size={13} />
              <span>{errors.address[0]}</span>
            </p>
          )}
        </div>
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-1">
            <span>Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
          />
          {errors.description && (
            <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
              <Info size={13} />
              <span>{errors.description[0]}</span>
            </p>
          )}
        </div>

        <div className="flex justify-between gap-4">
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
              <span>Commission Percent</span>{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(e.target.value)}
              type="number"
              className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
            />
            {errors.currentCommissionPercent && (
              <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
                <Info size={13} />
                <span>{errors.currentCommissionPercent[0]}</span>
              </p>
            )}
          </div>
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
              <span>Delivery Fee</span> <span className="text-red-500">*</span>
            </label>
            <input
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              type="number"
              className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
            />
            {errors.currentDeliveryFee && (
              <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
                <Info size={13} />
                <span>{errors.currentDeliveryFee[0]}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
              <span>Bkash</span>
            </label>
            <input
              value={bkash}
              onChange={(e) => setBkash(e.target.value)}
              type="text"
              className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
            />
            {errors.bkashAccount && (
              <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
                <Info size={13} />
                <span>{errors.bkashAccount[0]}</span>
              </p>
            )}
          </div>
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
              <span>Bank Account</span>
            </label>
            <input
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              type="text"
              className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
            />
            {errors.bankAccount && (
              <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
                <Info size={13} />
                <span>{errors.bankAccount[0]}</span>
              </p>
            )}
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
