"use client";
import axios from "axios";
import { CircleX, Info } from "lucide-react";
import { FormEvent, useState } from "react";
import * as z from "zod";

export const createAdminSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Max 100 characters allowed"),

  email: z
    .email("Invalid email address")
    .max(100, "Max 100 characters allowed"),

  password: z
    .string()
    .min(6, "Min 6 characters required")
    .max(32, "Max 32 characters allowed"),
});

export default function AddAdminForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors({});

    const result = createAdminSchema.safeParse({
      name,
      email,
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
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/admins`,
        result.data,
        {
          withCredentials: true,
        },
      );

      //   console.log(res.data);

      setName("");
      setEmail("");
      setPassword("");

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
            <span>Name</span> <span className="text-red-500">*</span>
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
          <button
            disabled={isLoading}
            type="submit"
            className="w-full mt-5 font-bold bg-pink-500 cursor-pointer px-5 py-3 text-white rounded-lg"
          >
            {isLoading ? "Creating Admin..." : "Create Admin Account"}
          </button>
        </div>
      </form>
    </div>
  );
}
