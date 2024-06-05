"use client"
import React, { useState } from "react";

function AdminForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: "admin" }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setMessage("Failed to add user");
    }
  };

  return (
    <div className="max-w-md mx-10">
      <h2 className="text-2xl font-bold mb-4">Add New Admin User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Email:</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-3 border rounded-md focus:outline-none focus:border-gray-400"
            required
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Password:</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-3 border rounded-md focus:outline-none focus:border-gray-400"
            required
          />
        </label>
        <button
          type="submit"
          className="bg-black text-white py-3 px-8 mt-4 hover:bg-black/90 transition duration-300"
        >
          Add User
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}

export default AdminForm;
