/**
 * 날짜 데이터를 'YYYY. MM. DD.' 형식의 문자열로 일관되게 포맷팅합니다.
 * 서버와 클라이언트 간의 로케일 차이로 인한 Hydration Mismatch를 방지합니다.
 */
export function formatDate(dateInput: string | Date | number): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}. ${m}. ${d}.`;
}
