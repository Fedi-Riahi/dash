"use client"
import React, { useState, useEffect } from "react";

const EditServiceForm = ({ categoryId, onUpdateCategoryName, onDeleteCategory }) => {
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: "",
    services: []
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/service/${categoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch category");
        }
        const data = await response.json();
        setCategory(data.service);
        setFormData({
          categoryName: data.service.categoryName,
          services: [...data.service.services]
        });
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };
    fetchCategory();
  }, [categoryId]);

  const handleChange = (index, key, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][key] = value;
    setFormData({ ...formData, services: updatedServices });
  };

  const handleDeleteService = (index) => {
    const updatedServices = [...formData.services];
    updatedServices.splice(index, 1);
    setFormData({ ...formData, services: updatedServices });
  };

  const handleDeleteCategory = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/service/${categoryId}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      alert("Category and its services deleted successfully");
      onDeleteCategory(); // Call the callback function to update the parent component
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/service/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const responseData = await response.json();
      if (response.status === 200) {
        alert("Category updated successfully");
        onUpdateCategoryName(formData.categoryName);
      } else {
        throw new Error(responseData.error || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert(error.message || "Failed to update category");
    }
  };

  return (
    <div>
      <h2>Edit Category</h2>
      {category && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="categoryName">Category Name:</label>
          <input
            type="text"
            id="categoryName"
            value={formData.categoryName}
            onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
          />
          {formData.services.map((service, index) => (
            <div key={index}>
              <label htmlFor={`serviceName-${index}`}>Service Name:</label>
              <input
                type="text"
                id={`serviceName-${index}`}
                value={service.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
              <label htmlFor={`servicePrice-${index}`}>Service Price:</label>
              <input
                type="number"
                id={`servicePrice-${index}`}
                value={service.price}
                onChange={(e) => handleChange(index, "price", parseFloat(e.target.value))}
              />
              <button type="button" onClick={() => handleDeleteService(index)}>Delete Service</button>
            </div>
          ))}
          <button type="submit">Update Category</button>
        </form>
      )}
      <button onClick={handleDeleteCategory}>Delete Category and Services</button>
    </div>
  );
};

export default EditServiceForm;
