"use client"
import React, { useState, useEffect } from "react";
import ServiceForm from "@/components/ServiceForm";
import EditServiceForm from "@/components/EditServiceForm"; 
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/navigation"; // Import useRouter hook

function Services() {
  const router = useRouter(); // Access router object
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editCategoryId, setEditCategoryId] = useState(null); // Track the ID of the category being edited

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/service");
        if (!response.ok) {
          throw new Error("Failed to fetch categories and services");
        }
        const data = await response.json();
        setCategories(data.services);
      } catch (error) {
        console.error("Error fetching categories and services:", error);
      }
    };
    fetchCategories();
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleEditCategory = (categoryId) => {
    setEditCategoryId(categoryId);
  };

  const handleUpdateCategoryName = (categoryId, newName) => {
    // Update category name in the state
    setCategories(categories.map(category => 
      category._id === categoryId ? {...category, categoryName: newName} : category
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="text-2xl font-bold mb-4">Categories and Services</h3>
      {editCategoryId ? ( // Render EditServiceForm if editCategoryId is set
        <EditServiceForm categoryId={editCategoryId} onUpdateCategoryName={handleUpdateCategoryName} />
      ) : (
        <div>
          {showForm ? (
            <ServiceForm />
          ) : (
            categories.map((category) => (
              <div key={category._id} className="mb-6">
                <h4 className="text-lg font-semibold mb-2">{category.categoryName}</h4>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleEditCategory(category._id)} // Set the editCategoryId when clicking the "Edit" button
                >
                  Edit
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.services.map((service) => (
                    <div key={service._id} className="bg-white rounded-lg shadow-md p-4">
                      <h5 className="text-lg font-semibold mb-2">{service.name}</h5>
                      <p className="text-gray-700">{service.price} DT</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
          <button
            className="bg-zinc hover:bg-black text-white py-3 px-8 "
            onClick={toggleForm}
          >
            Add Service
          </button>
        </div>
      )}
    </div>
  );
}

export default withAuth(Services);
