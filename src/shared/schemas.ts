import { z } from "zod/v4";

export const projectSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().min(1, "설명을 입력해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export const reviewSchema = z.object({
  content: z
    .string()
    .min(5, "후기는 최소 5자 이상 입력해주세요.")
    .max(1000, "후기는 최대 1000자까지 작성할 수 있습니다."),
  rating: z.number().int().min(1, "별점을 선택해주세요.").max(5),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
