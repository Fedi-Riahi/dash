"use client";
import React, { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";

function CarOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/order");

      if (!response.ok) {
        throw new Error("Failed to fetch car orders");
      }

      const data = await response.json();
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching car orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/order/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete car order");
      }

      fetchOrders();
    } catch (error) {
      console.error("Error deleting car order:", error);
    }
  };

  const changeStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/order/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update car order status");
      }

      fetchOrders();

      const updatedOrder = orders.find((order) => order._id === orderId);

      if (newStatus === "Confirmed" || newStatus === "Rejected") {
        await fetch(`/api/carOrderEmail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: updatedOrder.email,
            status: newStatus,
            phoneNumber: updatedOrder.phoneNumber,
          }),
        });
      }
    } catch (error) {
      console.error("Error updating car order status:", error);
    }
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-xl font-bold mb-4">Car Orders Management</h1>
      </div>

      {showOrderForm && <OrderForm />}

      {!showOrderForm && (
        <table className="w-full mt-5 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">{/* Checkbox */}</th>
              <th scope="col" className="px-6 py-3">Full Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Phone Number</th>
              <th scope="col" className="px-6 py-3">Items</th>
              <th scope="col" className="px-6 py-3">Total</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">Loading...</td>
              </tr>
            ) : orders && orders.length > 0 ? (
              orders.map((order, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="w-4 p-4">{/* Checkbox input */}</td>
                  <td className="px-6 py-4">{`${order.firstName} ${order.lastName}`}</td>
                  <td className="px-6 py-4">{order.email}</td>
                  <td className="px-6 py-4">{order.phone}</td>
                  <td className="px-6 py-4">
                    {order.items.map(item => item.itemName).join(", ")}
                  </td>
                  <td className="px-6 py-4">{order.totalPrice} DT</td>
                  
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="inline-flex items-start px-4 py-2 rounded-md shadow-sm text-sm font-medium text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">No car orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default withAuth(CarOrders);
