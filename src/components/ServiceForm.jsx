"use client"
import React, { useState } from 'react';
  
const ServiceForm = () => {
  const [categoryName, setCategoryName] = useState('');
  const [services, setServices] = useState([{ name: '', price: '' }]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleServiceChange = (index, key, value) => {
    const updatedServices = [...services];
    updatedServices[index][key] = value;
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([...services, { name: '', price: '' }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Fetch all existing categories
      const response = await fetch('api/service');
      const data = await response.json();
  
      // Extract categories from the response
      const categories = data.services;
  
      // Check if there is a category with a matching name
      const existingCategory = categories.find(category => category.categoryName === categoryName);
  
      if (existingCategory) {
        // If a matching category exists, append services to its existing services
        const categoryId = existingCategory._id;
        const updatedServices = [...existingCategory.services, ...services];
        const updateResponse = await fetch(`api/service/${categoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ services: updatedServices }),
        });
  
        if (!updateResponse.ok) {
          throw new Error('Failed to add services to existing category');
        }
  
        alert('Services added to existing category successfully');
      } else {
        // If no matching category exists, create a new category and add services to it
        const createResponse = await fetch('api/service', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categoryName, services }),
        });
  
        if (!createResponse.ok) {
          throw new Error('Failed to create services');
        }
  
        alert('Services created successfully');
      }
  
      // Reset form fields after successful submission
      setCategoryName('');
      setServices([{ name: '', price: '' }]);
    } catch (error) {
      console.error('Error adding services:', error);
      alert('Failed to add services');
    }
  };
  
  
  

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="mb-4">
        <label className="block text-gray-700">Category Name:</label>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full mt-1 px-4 py-3 border rounded-md focus:outline-none focus:border-zinc"
          required
        />
      </div>
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Services:</h4>
        {services.map((service, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700">Service Name:</label>
            <input
              type="text"
              value={service.name}
              onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
              className="w-full mt-1 px-4 py-3 border rounded-md focus:outline-none focus:border-zinc"
              required
            />
            <label className="block text-gray-700">Service Price:</label>
            <input
              type="number"
              value={service.price}
              onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
              className="w-full mt-1 px-4 py-3 border rounded-md focus:outline-none focus:border-zinc"
              required
            />
          </div>
        ))}
        <button type="button" onClick={addService} className="text-zinc">Add Service</button>
      </div>
      <button type="submit" className="bg-zinc text-white py-3 px-8 mt-4 hover:bg-black">Submit</button>
    </form>
  );
};

export default ServiceForm;
