// pages/listings/addlisting.js
"use client"
import React, { useState } from "react";
import ModelForm from "@/components/ModelForm";
import modelOptions from "@/data/options";
import withAuth from "@/utils/withAuth";

function AddListing() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
        <ModelForm modelOptions={modelOptions} />
    </div>
  );
}

export default withAuth(AddListing);
