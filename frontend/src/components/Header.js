// src/components/Header.js
import React, { useState } from "react";
import axios from "axios";
import AddProductModal from "./AddProductModal";

export default function Header({ onSearch }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Export CSV
  const handleExport = () => {
    window.open("http://localhost:4000/api/products/export", "_blank");
  };

  // Import CSV
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      await axios.post("http://localhost:4000/api/products/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // simple refresh
      window.location.reload();
    } catch (err) {
      alert("Import failed: " + (err?.response?.data?.error || err.message));
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-3">
        <input
          type="text"
          placeholder="Search products..."
          className="border p-2 rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (typeof onSearch === "function") onSearch(e.target.value);
          }}
        />

        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Grocery">Grocery</option>
          <option value="Electronics">Electronics</option>
        </select>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>

        <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
          Import
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImport}
          />
        </label>

        <button
          onClick={handleExport}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Export
        </button>
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          refresh={() => window.location.reload()}
        />
      )}
    </>
  );
}
