"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/shared/types";

const inputClass = "w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

export function EditProductForm({ product }: { product: Product }) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category);
  const [features, setFeatures] = useState<string[]>([...product.features]);
  const [featureInput, setFeatureInput] = useState("");

  const addFeature = () => {
    const v = featureInput.trim();
    if (v && !features.includes(v)) {
      setFeatures([...features, v]);
      setFeatureInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("제품 수정:", { id: product.id, name, description, category, features });
    alert("수정 완료 (Mock)");
  };

  return (
    <>
      <Link href="/admin/products" className="text-navy hover:underline dark:text-blue-400">← 목록으로</Link>
      <h1 className="mt-4 text-2xl font-bold text-navy dark:text-white">제품 수정</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-navy dark:text-gray-200">제품명</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-navy dark:text-gray-200">카테고리</span>
          <input value={category} onChange={(e) => setCategory(e.target.value)} required className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-navy dark:text-gray-200">설명</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required className={inputClass} />
        </label>
        <div>
          <span className="mb-1 block text-sm font-medium text-navy dark:text-gray-200">특징</span>
          <div className="flex gap-2">
            <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} className={inputClass} placeholder="특징 입력 후 추가" />
            <button type="button" onClick={addFeature} className="shrink-0 rounded-lg bg-navy px-4 py-2 text-sm text-white hover:bg-navy-light">추가</button>
          </div>
          {features.length > 0 && (
            <ul className="mt-2 space-y-1">
              {features.map((f, i) => (
                <li key={i} className="flex items-center justify-between rounded bg-gray-light px-3 py-1 text-sm dark:bg-gray-800 dark:text-gray-300">
                  {f}
                  <button type="button" onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700" aria-label={`${f} 삭제`}>✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="rounded-lg bg-navy px-6 py-2 text-white hover:bg-navy-light">저장</button>
      </form>
    </>
  );
}
