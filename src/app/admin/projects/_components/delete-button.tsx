"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/button";
import { deleteProject } from "../_actions";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("정말 이 시공사례를 삭제하시겠습니까?")) {
      return;
    }

    setIsLoading(true);
    const result = await deleteProject(id);
    if (!result.success) {
      alert(result.error);
      setIsLoading(false);
      return;
    }
    router.refresh();
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isLoading}
      variant="ghost"
      className="h-10 rounded-xl px-4 text-sm font-bold text-red-500 transition-all hover:bg-red-50 hover:text-red-700 active:scale-95 dark:hover:bg-red-950/20"
    >
      {isLoading ? "삭제 중..." : "삭제"}
    </Button>
  );
}
