"use client";
import React, { useState } from "react";
import AdminList from "@/components/AdminList";
import AdminForm from "@/components/AdminForm";

const Admins = () => {
  const [showAdminForm, setShowAdminForm] = useState(false);

  const toggleAdminForm = () => {
    setShowAdminForm(!showAdminForm);
  };

  return (
    <div className="">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-2xl font-bold mb-4 mx-10">Admins</h2>
        <button
          className="bg-black text-white py-3 px-8 mt-4 hover:bg-black/90 transition duration-300"
          onClick={toggleAdminForm}
        >
          Add Admin
        </button>
      </div>
      {showAdminForm ? (
        <AdminForm />
      ) : (
        <>
          <AdminList />
        </>
      )}
    </div>
  );
};

export default Admins;
