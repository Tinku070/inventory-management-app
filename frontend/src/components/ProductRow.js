import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function ProductRow({ item, refresh, openHistory }) {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: item.name,
    unit: item.unit,
    category: item.category,
    brand: item.brand,
    stock: item.stock,
    status: item.status,
    image: item.image,
  });

  const save = async () => {
    await axios.put(`${API_URL}/api/products/${item.id}`, form);
    setIsEditing(false);
    refresh();
  };

  const remove = async () => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`${API_URL}/api/products/${item.id}`);
    refresh();
  };

  return (
    <tr className="border-b">

      {/* IMAGE */}
      <td className="p-2">
        {item.image ? (
          <img src={item.image} alt="" className="w-12 h-12 object-cover" />
        ) : (
          "—"
        )}
      </td>

      {/* NAME */}
      <td className="p-2">
        {isEditing ? (
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-1 rounded"
          />
        ) : (
          item.name
        )}
      </td>

      {/* UNIT */}
      <td className="p-2">
        {isEditing ? (
          <input
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            className="border p-1 rounded"
          />
        ) : (
          item.unit
        )}
      </td>

      {/* CATEGORY */}
      <td className="p-2">
        {isEditing ? (
          <input
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="border p-1 rounded"
          />
        ) : (
          item.category
        )}
      </td>

      {/* BRAND */}
      <td className="p-2">
        {isEditing ? (
          <input
            value={form.brand}
            onChange={(e) =>
              setForm({ ...form, brand: e.target.value })
            }
            className="border p-1 rounded"
          />
        ) : (
          item.brand
        )}
      </td>

      {/* STOCK */}
      <td className="p-2">
        {isEditing ? (
          <input
            type="number"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
            className="border p-1 rounded"
          />
        ) : (
          item.stock
        )}
      </td>

      {/* STATUS */}
      <td className="p-2">
        {form.stock > 0 ? (
          <span className="text-green-600 font-bold">In Stock</span>
        ) : (
          <span className="text-red-600 font-bold">Out of Stock</span>
        )}
      </td>

      {/* ACTIONS */}
      <td className="p-2">
        {isEditing ? (
          <>
            <button onClick={save} className="text-green-600 mr-3">Save</button>
            <button onClick={() => setIsEditing(false)} className="text-gray-600">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="text-blue-600 mr-3">
              Edit
            </button>
            <button onClick={openHistory} className="text-green-600 mr-3">
              History
            </button>
            <button onClick={remove} className="text-red-600">
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
