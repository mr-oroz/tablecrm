
'use client';

import ProductForm from "@/components/product-form/product-form";
import {ProductAutoFill} from "@/types/product-auto-fill";
import {useState} from "react";

export default function Home() {
  const [autoFillData, setAutoFillData] = useState<ProductAutoFill | null>(null);

  const handleAutoFill = async (productName: string): Promise<ProductAutoFill> => {
    const response = await fetch("/api/autofill-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: productName }),
    });

    const data: ProductAutoFill = await response.json();

    setAutoFillData(data);

    return data;
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <ProductForm  onRequestAutoFill={handleAutoFill}/>
    </main>
  );
}
