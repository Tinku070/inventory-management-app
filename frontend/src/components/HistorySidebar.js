import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function HistorySidebar({ productId, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/products/${productId}/history`).then((res) => {
      setHistory(res.data);
    });
  }, [productId]);

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl border-l p-5">
      <h2 className="text-xl font-semibold mb-4">Inventory History</h2>

      <button onClick={onClose} className="text-red-600 underline mb-4">
        Close
      </button>

      {history.length === 0 ? (
        <p className="text-gray-600">No history found.</p>
      ) : (
        <ul className="space-y-3">
          {history.map((log) => (
            <li key={log.id} className="border p-2 rounded">
              <p><b>Old Stock:</b> {log.oldStock}</p>
              <p><b>New Stock:</b> {log.newStock}</p>
              <p><b>Changed By:</b> {log.changedBy}</p>
              <p><b>Date:</b> {new Date(log.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
