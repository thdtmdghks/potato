import { z } from "zod/v4";

export const inquirySchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z.string().min(1, "연락처를 입력해주세요"),
  email: z.email("올바른 이메일을 입력해주세요").optional().or(z.literal("")),
  type: z.string().min(1, "유형을 선택해주세요"),
  address: z.string().min(1, "주소를 입력해주세요"),
  content: z.string().min(1, "문의 내용을 입력해주세요"),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

export const projectSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().min(1, "설명을 입력해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
