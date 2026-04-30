"use client";
import axios from "axios";
import { CircleX, Info } from "lucide-react";
import { FormEvent, useState } from "react";
import * as z from "zod";

export const createRiderSchema = z.object({
  name: z
    .string()
    .min(1, "Rider name is required")
    .max(100, "Max 100 characters allowed"),

  riderNid: z.string().regex(/^\d{10,17}$/, "NID must be 10–17 digits"),

  email: z
    .email("Invalid email address")
    .max(100, "Max 100 characters allowed"),

  password: z
    .string()
    .min(6, "Min 6 characters required")
    .max(32, "Max 32 characters allowed"),

  phone: z.string().regex(/^(?:\+88)?01[0-9]{9}$/, "Invalid phone number"),

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

  nid_img: z
    .file("Choose an NID")
    .max(2 * 1024 * 1024, "Max 2 MB")
    .mime(
      ["image/jpeg", "image/png", "image/webp"],
      "Only Image Format Allowed",
    ),
});

export default function AddRiderForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [nid, setNid] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [bankAccount, setBankAccount] = useState<string>("");
  const [bkash, setBkash] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors({});

    const result = createRiderSchema.safeParse({
      name,
      email,
      password,
      riderNid: nid,
      phone,
      bkashAccount: bkash,
      bankAccount: bankAccount,
      nid_img: file,
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
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", result.data.name);
      formData.append("email", result.data.email);
      formData.append("password", result.data.password);
      formData.append("riderNid", result.data.riderNid);
      formData.append("phone", result.data.phone);
      if (result.data.bkashAccount)
        formData.append("bkashAccount", result.data.bkashAccount);
      if (result.data.bankAccount)
        formData.append("bankAccount", result.data.bankAccount);
      formData.append("nid_img", result.data.nid_img);

      const res = await axios.post(
        "http://localhost:5000/admin/riders",
        formData,
      );

      //   console.log(res.data);

      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setNid("");
      setBkash("");
      setBankAccount("");
      setFile(null);

      onSuccess();
    } catch (error: any) {
      const messages = error.response?.data?.message;

      if (Array.isArray(messages)) {
        setErrors({ server: messages });
      } else {
        setErrors({ server: [messages || "Something went wrong"] });
      }
    } finally {
      setIsLoading(false);
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
            <span>Rider Name</span> <span className="text-red-500">*</span>
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
            <span>NID</span> <span className="text-red-500">*</span>
          </label>
          <input
            value={nid}
            onChange={(e) => setNid(e.target.value)}
            type="text"
            className="block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
          />
          {errors.riderNid && (
            <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
              <Info size={13} />
              <span>{errors.riderNid[0]}</span>
            </p>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="">
            <span className="inline-block font-medium text-gray-700 mb-1">
              Upload NID
            </span>{" "}
            <span className="text-red-500">*</span>
            <input
              className="cursor-pointer block w-full border rounded-lg border-gray-300 p-2 bg-white focus:outline-none"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) setFile(selected);
                else setFile(null);
              }}
              type="file"
            />
          </label>
          {errors.nid_img && (
            <p className="flex items-center gap-2 text-sm text-red-600 mt-1">
              <Info size={13} />
              <span>{errors.nid_img[0]}</span>
            </p>
          )}
        </div>

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

        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-1">
            <span>Phone</span> <span className="text-red-500">*</span>
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
            disabled={isLoading}
            type="submit"
            className="w-full mt-5 font-bold bg-pink-500 cursor-pointer px-5 py-3 text-white rounded-lg"
          >
            {isLoading ? "Creating Rider..." : "Create Rider Account"}
          </button>
        </div>
      </form>
    </div>
  );
}
