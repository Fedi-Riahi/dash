"use client"
import React, { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";

function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const fetchQuotes = async () => {
    try {
      const response = await fetch("/api/quote");

      if (!response.ok) {
        throw new Error("Failed to fetch quotes");
      }

      const data = await response.json();
      setQuotes(data.quotes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const deleteQuote = async (quoteId) => {
    try {
      const response = await fetch(`/api/quote/${quoteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete quote");
      }

      fetchQuotes();
    } catch (error) {
      console.error("Error deleting quote:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Function to handle status change
  const changeStatus = async (quoteId, newStatus) => {
    try {
      const response = await fetch(`/api/quote/${quoteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quote status");
      }

      fetchQuotes(); // Fetch updated quotes

      // Get the updated quote details
      const updatedQuote = quotes.find((quote) => quote._id === quoteId);

      // Send email notification if status changed to Confirmed or Rejected
      if (newStatus === "Confirmed" || newStatus === "Rejected") {
        await fetch(`/api/quoteEmail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: updatedQuote.email,
            status: newStatus,
            phoneNumber:updatedQuote.phoneNumber
          }),
        });
      }
    } catch (error) {
      console.error("Error updating quote status:", error);
    }
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-xl font-bold mb-4">Quotes Management</h1>
        {!showQuoteForm && (
          <button
            onClick={() => setShowQuoteForm(true)}
            className="px-4 py-2 rounded text-white bg-zinc hover:bg-zinc/[0.9]"
          >
            Add Quote
          </button>
        )}
      </div>

      {showQuoteForm && <QuoteForm />}

      {!showQuoteForm && (
        <table className="w-full mt-5 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                {/* Checkbox */}
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : quotes && quotes.length > 0 ? (
              quotes.map((quote, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="w-4 p-4">{/* Checkbox input */}</td>
                  <td className="px-6 py-4">{quote.firstName}</td>
                  <td className="px-6 py-4">{quote.email}</td>
                  <td className="px-6 py-4">{quote.phoneNumber}</td>
                  <td className="px-6 py-4">{formatDate(quote.date)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={quote.status}
                      onChange={(e) => changeStatus(quote._id, e.target.value)}
                      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option
                        style={{
                          backgroundColor: "#fff",
                          color:
                            quote.status === "Confirmed" ? "#0F9D58" : "#000",
                        }}
                        value="Confirmed"
                      >
                        Confirmed
                      </option>
                      <option
                        style={{
                          backgroundColor: "#fff",
                          color:
                            quote.status === "Pending" ? "#FFD33D" : "#000",
                        }}
                        value="Pending"
                      >
                        Pending
                      </option>
                      <option
                        style={{
                          backgroundColor: "#fff",
                          color:
                            quote.status === "Rejected" ? "#DB4437" : "#000",
                        }}
                        value="Rejected"
                      >
                        Rejected
                      </option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteQuote(quote._id)}
                      className="inline-flex items-start px-4 py-2 rounded-md shadow-sm text-sm font-medium text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No quotes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default withAuth(Quotes);
