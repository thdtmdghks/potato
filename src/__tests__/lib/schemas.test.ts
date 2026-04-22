import { describe, it, expect } from 'vitest';
import { inquirySchema } from '@/lib/schemas';

const valid = { name: '홍길동', phone: '010-1234-5678', email: 'test@example.com', type: '웹사이트', address: '서울시', content: '문의합니다' };

describe('inquirySchema', () => {
  it('유효한 데이터를 통과시킨다', () => {
    expect(inquirySchema.safeParse(valid).success).toBe(true);
  });

  it('email이 빈 문자열이면 통과한다', () => {
    expect(inquirySchema.safeParse({ ...valid, email: '' }).success).toBe(true);
  });

  it('email이 없으면 통과한다', () => {
    const { email: _, ...noEmail } = valid;
    expect(inquirySchema.safeParse(noEmail).success).toBe(true);
  });

  it('name이 비어있으면 실패한다', () => {
    expect(inquirySchema.safeParse({ ...valid, name: '' }).success).toBe(false);
  });

  it('phone이 비어있으면 실패한다', () => {
    expect(inquirySchema.safeParse({ ...valid, phone: '' }).success).toBe(false);
  });

  it('잘못된 email이면 실패한다', () => {
    expect(inquirySchema.safeParse({ ...valid, email: 'invalid' }).success).toBe(false);
  });

  it('content가 비어있으면 실패한다', () => {
    expect(inquirySchema.safeParse({ ...valid, content: '' }).success).toBe(false);
  });
});
