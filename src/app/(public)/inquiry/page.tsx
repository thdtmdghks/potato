"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryFormData } from "@/shared/schemas";
import { compressImage } from "@/client/image";
import { useState, useRef } from "react";

const MAX_FILES = 5;
const serviceTypes = ["웹사이트", "앱", "디자인", "기타"];

export default function Inquiry() {
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [compressing, setCompressing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  });

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;
    const remaining = MAX_FILES - files.length;
    if (remaining <= 0) return;
    setCompressing(true);
    try {
      const compressed = await Promise.all(
        selected.slice(0, remaining).map((f) => compressImage(f))
      );
      setFiles((prev) => [...prev, ...compressed]);
    } finally {
      setCompressing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: InquiryFormData) => {
    console.log("견적문의 제출:", data, "첨부파일:", files);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="py-16 text-center">
        <h1 className="text-3xl font-bold text-navy dark:text-white">문의가 접수되었습니다</h1>
        <p className="mt-4 text-gray-dark dark:text-gray-300">빠른 시일 내에 연락드리겠습니다.</p>
      </section>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-navy dark:text-white">견적문의</h1>
      <p className="mt-2 text-gray-dark dark:text-gray-300">
        프로젝트에 대해 알려주시면 최적의 견적을 안내해 드립니다.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 max-w-2xl space-y-6">
        <fieldset>
          <legend className="sr-only">기본 정보</legend>
          <div className="grid gap-6 sm:grid-cols-2">

          <Field label="이름" id="name" error={errors.name?.message} required>
            <input id="name" {...register("name")} aria-describedby={errors.name ? "name-error" : undefined} className={inputClass} placeholder="홍길동" />
          </Field>

          <Field label="연락처" id="phone" error={errors.phone?.message} required>
            <input id="phone" {...register("phone")} type="tel" aria-describedby={errors.phone ? "phone-error" : undefined} className={inputClass} placeholder="010-1234-5678" />
          </Field>

          <Field label="이메일" id="email" error={errors.email?.message}>
            <input id="email" {...register("email")} type="email" aria-describedby={errors.email ? "email-error" : undefined} className={inputClass} placeholder="example@email.com" />
          </Field>

          <Field label="서비스 유형" id="type" error={errors.type?.message} required>
            <select id="type" {...register("type")} aria-describedby={errors.type ? "type-error" : undefined} className={inputClass} defaultValue="">
              <option value="" disabled>선택해주세요</option>
              {serviceTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
          </div>
        </fieldset>

        <Field label="주소" id="address" error={errors.address?.message} required>
          <input id="address" {...register("address")} aria-describedby={errors.address ? "address-error" : undefined} className={inputClass} placeholder="서울시 강남구" />
        </Field>

        <Field label="문의 내용" id="content" error={errors.content?.message} required>
          <textarea id="content" {...register("content")} rows={5} aria-describedby={errors.content ? "content-error" : undefined} className={inputClass} placeholder="프로젝트에 대해 자세히 알려주세요." />
        </Field>

        <div>
          <label htmlFor="files" className="mb-1 block text-sm font-medium text-navy dark:text-gray-200">
            참고 이미지 <span className="text-xs text-gray-dark dark:text-gray-400">(최대 {MAX_FILES}장, 자동 압축)</span>
          </label>
          <input
            ref={fileRef}
            id="files"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            disabled={files.length >= MAX_FILES || compressing}
            className={inputClass}
          />
          {compressing && <p className="mt-1 text-xs text-gray-dark dark:text-gray-400">압축 중...</p>}
          {files.length > 0 && (
            <ul className="mt-2 space-y-1">
              {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between rounded bg-gray-light px-3 py-1 text-sm dark:bg-gray-800">
                  <span className="truncate text-gray-dark dark:text-gray-300">{f.name} ({(f.size / 1024).toFixed(0)}KB)</span>
                  <button type="button" onClick={() => removeFile(i)} className="ml-2 text-red-500 hover:text-red-700" aria-label={`${f.name} 삭제`}>✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-navy px-8 py-3 font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-50 sm:w-auto"
        >
          {isSubmitting ? "제출 중..." : "견적문의 보내기"}
        </button>
      </form>
    </>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

function Field({
  label,
  id,
  error,
  required,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy dark:text-gray-200">
        {label}
        {required && <span className="text-red-500" aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && <span id={errorId} role="alert" className="mt-1 block text-xs text-red-500">{error}</span>}
    </div>
  );
}
