import React, { useState } from "react";
import axios from "axios";
import AddProductModal from "./AddProductModal";
import { API_URL } from "../config";

export default function Header({ setSearch, setCategory }) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleExport = () => {
    window.open(`${API_URL}/api/products/export`, "_blank");
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("csvFile", file);

    await axios.post(`${API_URL}/api/products/import`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    window.location.reload();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-3">

        {/* Search */}
        <input
          placeholder="Search products..."
          className="border p-2 rounded w-full md:w-1/3"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="border p-2 rounded"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Grocery">Grocery</option>
          <option value="Electronics">Electronics</option>
        </select>

        {/* Add Product */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowAddModal(true)}
        >
          Add Product
        </button>

        {/* Import */}
        <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
          Import
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImport}
          />
        </label>

        {/* Export */}
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
