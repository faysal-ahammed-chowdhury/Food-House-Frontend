"use client";
import { Customer } from "@/types/admin/Customer";
import axios from "axios";
import { CheckCircle, CircleX, Info } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import * as z from "zod";

export const editCustomerSchema = z.object({
  name: z.preprocess((val) => {
    if (String(val).trim() === "") return undefined;
    return val;
  }, z.string().min(1, "Name is required").max(100, "Max 100 characters allowed").optional()),

  password: z.preprocess((val) => {
    if (String(val).trim() === "") return undefined;
    return val;
  }, z.string().min(6, "Min 6 characters required").max(32, "Max 32 characters allowed").optional()),

  address: z.preprocess((val) => {
    if (String(val).trim() === "") return undefined;
    return val;
  }, z.string().min(1, "Address is required").max(100, "Max 100 characters allowed").optional()),

  phone: z.preprocess(
    (val) => {
      if (typeof val !== "string") return undefined;
      const v = val.trim();
      return v === "" ? undefined : v;
    },
    z
      .string()
      .regex(/^(?:\+88)?01[0-9]{9}$/, "Invalid Phone number")
      .optional(),
  ),

  isVerified: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean(),
  ),
});

export default function EditCustomerForm({
  customer,
  onSuccess,
}: {
  customer: Customer;
  onSuccess: () => void;
}) {
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isCustomerVerified, setIsCustomerVerified] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    setName(customer.user.name);
    setEmail(customer.user.email);
    setAddress(customer.address);
    setPhone(customer.phone);
    setIsCustomerVerified(customer.user.isVerified);
  }, [customer]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    const result = editCustomerSchema.safeParse({
      name,
      password,
      address,
      phone,
      isVerified: isCustomerVerified,
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
    // return;
    setLoading(true);

    try {
      const res = await axios.put(
        `http://localhost:5000/admin/customers/${customer.customerId}`,
        result.data,
      );

      onSuccess();
      setSuccessMsg(`${name} Updated Successfully`);
      console.log(res.data);
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
      <p className="mb-5 text-xs text-slate-500 flex items-center gap-2 text-red-600">
        <Info size={14} />
        <span>Leave blank/same to keep the current value.</span>
      </p>
      <div>
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
        {successMsg?.length > 0 && (
          <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle size={18} className="shrink-0" />
              <p className="text-sm font-medium">{successMsg}</p>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-1">
            <span>Customer</span>
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
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-1">
            <span>Email</span>
          </label>
          <input
            disabled={true}
            value={email}
            type="text"
            className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none disabled:bg-gray-50 
           disabled:text-gray-500 
           disabled:border-gray-200 
           disabled:shadow-none
           disabled:cursor-not-allowed"
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
            <span>Phone</span>
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="text"
            className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
          />
          {errors.phone && (
            <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
              <Info size={13} />
              <span>{errors.phone[0]}</span>
            </p>
          )}
        </div>
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-1">
            <span>Password</span>
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
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-1">
            <span>Address</span>
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
            <span>Total Orders</span>
          </label>
          <input
            disabled={true}
            value={customer.totalOrder}
            type="text"
            className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none disabled:bg-gray-50 
            disabled:text-gray-500 
           disabled:border-gray-200 
           disabled:shadow-none
           disabled:cursor-not-allowed"
          />
        </div>

        <div className="full">
          <div className="flex gap-2 font-medium">
            <input
              checked={isCustomerVerified}
              onChange={() => setIsCustomerVerified(!isCustomerVerified)}
              id={String(customer.customerId)}
              type="checkbox"
              className="cursor-pointer"
            />
            <label
              htmlFor={String(customer.customerId)}
              className="cursor-pointer"
            >
              Is Verified
            </label>
          </div>
        </div>

        <div className="w-full">
          <button
            disabled={loading}
            type="submit"
            className="w-full mt-5 font-bold bg-pink-500 cursor-pointer px-5 py-3 text-white rounded-lg"
          >
            {loading ? "Updating Customer..." : "Update Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}
