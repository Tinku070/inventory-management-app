import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductRow from "./ProductRow";
import HistorySidebar from "./HistorySidebar";

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const loadProducts = () => {
    axios
      .get("http://localhost:4000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadProducts();
  }, []);

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
            {products.map((item) => (
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
