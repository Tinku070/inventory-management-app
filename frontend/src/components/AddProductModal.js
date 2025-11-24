import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function AddProductModal({ onClose, refresh }) {
  const [form, setForm] = useState({
    name: "",
    unit: "",
    category: "",
    brand: "",
    stock: 0,
    status: "In Stock",
    image: "",
  });

  const submit = async () => {
    await axios.post(`${API_URL}/api/products`, form);
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
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
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
        />

        <input
          placeholder="Image URL"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
