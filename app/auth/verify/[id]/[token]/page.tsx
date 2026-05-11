"use client";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const { id } = useParams();
  const { token } = useParams();
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const verifyUser = async () => {
    setIsError(false);
    setIsLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify/${id}/${token}`,
      );
      setMessage(res.data.message);
    } catch (err) {
      setIsError(true);
      setMessage(err?.response?.data?.message || "Invalid Request");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, [id, token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="text-center">
        <h1
          className={`text-2xl font-bold ${isError ? "text-red-600" : "text-green-600"}`}
        >
          {isLoading ? "Loading..." : message}
        </h1>

        {/* Basic link to get them back to the app */}
        <div className="mt-6">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-pink-600 hover:underline"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
