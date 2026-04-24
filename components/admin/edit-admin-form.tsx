"use client";
import { Admin } from "@/types/admin/Admin";
import axios from "axios";
import { CheckCircle, CircleX, Info } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import * as z from "zod";

export const editAdminSchema = z.object({
  name: z.preprocess((val) => {
    if (String(val).trim() === "") return undefined;
    return val;
  }, z.string().min(1, "Name is required").max(100, "Max 100 characters allowed").optional()),

  password: z.preprocess((val) => {
    if (String(val).trim() === "") return undefined;
    return val;
  }, z.string().min(6, "Min 6 characters required").max(32, "Max 32 characters allowed").optional()),
});

export default function EditAdminForm({
  admin,
  onSuccess,
}: {
  admin: Admin;
  onSuccess: () => void;
}) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    setName(admin.name);
    setEmail(admin.email);
  }, [admin]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    const result = editAdminSchema.safeParse({
      name,
      password,
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
        `http://localhost:5000/admin/admins/${admin.userId}`,
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
            <span>Name</span>
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
          <button
            disabled={loading}
            type="submit"
            className="w-full mt-5 font-bold bg-pink-500 cursor-pointer px-5 py-3 text-white rounded-lg"
          >
            {loading ? "Updating Admin..." : "Update Admin"}
          </button>
        </div>
      </form>
    </div>
  );
}
