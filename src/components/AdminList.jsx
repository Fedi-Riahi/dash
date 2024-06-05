"use client"
import React, { useState, useEffect } from "react";

function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);
  const [editAdminId, setEditAdminId] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          throw new Error("Failed to fetch admins");
        }
        const data = await response.json();
        const adminUsers = data.users.filter(user => user.role === "admin");
        setAdmins(adminUsers);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAdmins();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/user/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete admin");
      }
      // Remove the deleted admin from the state
      setAdmins(admins.filter(admin => admin._id !== id));
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  const handleEdit = (id) => {
    // Set the editAdminId to the id of the admin being edited
    setEditAdminId(id);
    // Fetch the admin details if needed
    // For simplicity, you can directly edit the email and password
    const adminToEdit = admins.find(admin => admin._id === id);
    setNewEmail(adminToEdit.email);
    setNewPassword(""); // You may choose to set a default value or leave it empty
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/user/${editAdminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });
      if (!response.ok) {
        throw new Error("Failed to update admin");
      }
      // Refresh the admins list after update
      setEditAdminId(null);
      setNewEmail("");
      setNewPassword("");
      fetchAdmins();
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  return (
    <div className="max-w-md mx-10">
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid gap-4">
        {admins.map((admin, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <p className="text-lg font-bold">{admin.firstName} {admin.lastName}</p>
            <p className="text-gray-600">{admin.email}</p>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-black text-white px-4 py-2 "
                onClick={() => handleEdit(admin._id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2  mr-2"
                onClick={() => handleDelete(admin._id)}
              >
                Delete
              </button>
            </div>
            {editAdminId === admin._id && (
              <div className="mt-4">
                <input
                  type="email"
                  placeholder="New Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 mt-2"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 mt-2"
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminList;
