import React, { useState } from "react";
import Header from "./components/Header";
import ProductTable from "./components/ProductTable";

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white p-6 shadow rounded-lg">
        <Header setSearch={setSearch} setCategory={setCategory} />
        <ProductTable search={search} category={category} />
      </div>
    </div>
  );
}
