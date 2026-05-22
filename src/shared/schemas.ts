import { z } from "zod/v4";

export const projectSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().min(1, "설명을 입력해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
