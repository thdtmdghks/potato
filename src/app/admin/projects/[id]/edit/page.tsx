"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    // Mock: 실제로는 API에서 데이터 fetch
    setTitle(`프로젝트 ${id}`);
    setDescription("기존 설명");
    setCategory("웹");
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("프로젝트 수정:", { id, title, description, category });
    alert("수정 완료 (Mock)");
  };

  return (
    <>
      <Link href="/admin/projects" className="text-navy hover:underline dark:text-blue-400">← 목록으로</Link>
      <h1 className="mt-4 text-2xl font-bold text-navy dark:text-white">프로젝트 수정</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-navy dark:text-gray-200">제목</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-navy dark:text-gray-200">카테고리</span>
          <input value={category} onChange={(e) => setCategory(e.target.value)} required className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-navy dark:text-gray-200">설명</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required className={inputClass} />
        </label>
        <p className="text-sm text-gray-dark dark:text-gray-400">이미지 업로드는 백엔드 연동 후 지원됩니다.</p>
        <button type="submit" className="rounded-lg bg-navy px-6 py-2 text-white hover:bg-navy-light">저장</button>
      </form>
    </>
  );
}

const inputClass = "w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";
