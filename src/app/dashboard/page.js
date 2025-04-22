"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const res = await fetch("/api/xendit/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          email: session?.user?.email, // ✅ dynamic user email
          remarks: "Dashboard payment", // optional
        }),
      });

      const data = await res.json();
      if (data?.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        console.error("Failed to create invoice");
      }
    } catch (err) {
      console.error("Error creating invoice:", err);
    }
  };

  return (
    <div className="grid place-content-center h-screen">
      <div className="flex justify-between my-10">
        <div className="flex mx-2 justify-between items-center">
          <img src="/usr.png" alt="User" className="h-10 w-10" />
          <span className="flex flex-col gap-2">{session?.user?.email}</span>
        </div>
        <div className="bg-amber-300 border py-2 px-4 rounded-full">
          <button onClick={() => signOut()}>Log out</button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-100 h-100 bg-gray-200 rounded-2xl py-10 px-6 flex flex-col gap-6"
      >
        <h1 className="text-center font-bold text-xl">
          CHABBYKITSHENKO CATERING SERVICES
        </h1>
        <div className="flex justify-center">
          <label className="flex flex-col gap-2">
            <span className="text-center">Enter Amount</span>
            <div className="flex items-center border border-amber-300 rounded bg-white overflow-hidden">
              <span className="px-4 text-gray-600">₱</span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="py-4 px-2 outline-none w-full"
              />
            </div>
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="border hover:bg-amber-200 rounded-full py-2 px-6 text-lg font-semibold"
          >
            Pay online
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;
