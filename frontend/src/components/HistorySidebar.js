import React, { useEffect, useState } from "react";
import axios from "axios";

export default function HistorySidebar({ productId, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (productId) {
      axios
        .get(`http://localhost:4000/api/products/${productId}/history`)
        .then((res) => setHistory(res.data))
        .catch((err) => console.error(err));
    }
  }, [productId]);

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl border-l p-5 z-50 transition-transform duration-300">
      <h2 className="text-xl font-semibold mb-4">Inventory History</h2>

      <button
        onClick={onClose}
        className="mb-4 text-red-600 font-semibold underline"
      >
        Close
      </button>

      {history.length === 0 ? (
        <p className="text-gray-600">No history found.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((log) => (
            <li key={log.id} className="border p-3 rounded bg-gray-50">
              <p>
                <b>Old Stock:</b> {log.oldStock}
              </p>
              <p>
                <b>New Stock:</b> {log.newStock}
              </p>
              <p>
                <b>Changed By:</b> {log.changedBy}
              </p>
              <p>
                <b>Date:</b> {new Date(log.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
