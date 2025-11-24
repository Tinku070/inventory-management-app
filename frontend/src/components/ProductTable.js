import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductRow from "./ProductRow";
import HistorySidebar from "./HistorySidebar";
import { API_URL } from "../config";

export default function ProductTable({ search, category }) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const loadProducts = () => {
    axios.get(`${API_URL}/api/products`).then((res) => {
      setProducts(res.data);
      setFiltered(res.data);
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Apply filtering whenever search/category changes
  useEffect(() => {
    let data = [...products];

    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      data = data.filter((p) => p.category === category);
    }

    setFiltered(data);
  }, [search, category, products]);

  return (
    <>
      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Image</th>
              <th className="p-2">Name</th>
              <th className="p-2">Unit</th>
              <th className="p-2">Category</th>
              <th className="p-2">Brand</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <ProductRow
                key={item.id}
                item={item}
                refresh={loadProducts}
                openHistory={() => setSelectedProductId(item.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedProductId && (
        <HistorySidebar
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </>
  );
}
