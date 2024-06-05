"use client"
import React, { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase'; // Import your Firebase storage configuration
import { v4 as uuidv4 } from 'uuid';

const NewsForm = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const imageUploadRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Get the file from the file input element
      const file = imageUploadRef.current.files[0];

      // Generate unique folder ID using uuid
      const folderId = uuidv4();

      // Upload image to Firebase storage under images/folderId
      const imageRef = ref(storage, `images/${folderId}/${file.name}`);
      await uploadBytesResumable(imageRef, file);

      // Get download URL for the uploaded image
      const imageUrl = await getDownloadURL(imageRef);

      // Prepare form data
      const formData = {
        title,
        category,
        image: imageUrl,
        folderId,
      };

      const response = await fetch("api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit news");
      }

      setMessage('News submitted successfully');

      // Clear form fields after successful submission
      setTitle('');
      setCategory('');
    } catch (error) {
      console.error('Error submitting news:', error);
      setMessage('Failed to submit news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mx-auto bg-white p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-3">
            <h3 className="text-lg font-bold mb-2">News Details</h3>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter news title"
              className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              required
            >
              <option value="">Select category</option>
              <option value="Cars">Cars</option>
              <option value="Events">Events</option>
            </select>
          </div>
          <div className="col-span-3">
            <h3 className="text-lg font-bold mb-2">Image</h3>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="image">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              ref={imageUploadRef}
              className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-zinc hover:bg-zinc/[0.9] text-white py-2 px-4 rounded"
        >
          Submit News
        </button>
      </form>
    </div>
  );
};

export default NewsForm;
