"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/button";
import { deleteProject } from "../_actions";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const result = await deleteProject(id);
    if (!result.success) {
      alert(result.error);
      return;
    }
    router.refresh();
  };

  return (
    <Button
      onClick={handleDelete}
      variant="ghost"
      className="text-sm text-red-500 hover:text-red-700"
    >
      삭제
    </Button>
  );
}
