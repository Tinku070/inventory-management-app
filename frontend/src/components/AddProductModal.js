// src/components/AddProductModal.js
import React, { useState } from "react";
import axios from "axios";

export default function AddProductModal({ onClose, refresh }) {
  const [form, setForm] = useState({
    name: "",
    unit: "",
    category: "",
    brand: "",
    stock: 0,
    status: "In Stock",
    image: ""
  });

  const handleSubmit = async () => {
    await axios.post("http://localhost:4000/api/products", form);
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-40">
      <div className="bg-white p-6 shadow-lg rounded w-96">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

        <input
          placeholder="Name"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Unit"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        />

        <input
          placeholder="Category"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          placeholder="Brand"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />

        <input
          placeholder="Stock"
          type="number"
          className="border p-2 mb-2 w-full"
          onChange={(e) =>
            setForm({ ...form, stock: Number(e.target.value) })
          }
        />

        <input
          placeholder="Image URL"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        <div className="flex justify-end mt-4 gap-3">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
