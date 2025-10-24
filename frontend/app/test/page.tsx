"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await fetch("/api/test");
        const data = await res.json();
        setMessage(data.message);
      } catch (err) {
        console.error("Fetch error:", err);
        setMessage("⚠️ Could not connect to backend");
      }
    };

    getMessage();
  }, []);

  if (!message) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400 text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-green-600">{message}</h1>
    </div>
  );
}
