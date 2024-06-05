"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import NewsForm from "@/components/NewsForm";
import withAuth from "@/utils/withAuth";
function News() {
  const [newsPosts, setNewsPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchNewsPosts = async () => {
      try {
        const response = await fetch("api/news");
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();
        setNewsPosts(data.newsPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };
    fetchNewsPosts();
  }, []);

  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
      {!isAddModalOpen && (
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">News Management</h1>
          <button
            onClick={handleAddModalOpen}
            className="px-4 py-2 bg-zinc text-white rounded hover:bg-zinc-[0.9]"
          >
            Add News
          </button>
        </div>
      )}
      {isAddModalOpen ? (
        <NewsForm onClose={handleAddModalClose} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            newsPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md overflow-hidden relative"
              >
                {post.image.length > 0 && (
                  <img
                    src={post.image[0]}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 text-blue-500">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-2 absolute top-4 left-2">
                    <span className=" px-2 py-2 bg-zinc text-white">{post.category}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default withAuth(News);
