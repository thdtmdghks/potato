/**
 * 날짜 데이터를 'YYYY. MM. DD.' 형식의 문자열로 일관되게 포맷팅합니다.
 * 서버와 클라이언트 간의 로케일 차이로 인한 Hydration Mismatch를 방지합니다.
 */
export const formatDate = (dateInput: string | Date | number): string => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}. ${m}. ${d}.`;
};

/**
 * 시간 기반 UUID v7을 생성합니다. (브라우저/서버 공용)
 */
export const generateUUIDv7 = (): string => {
  const timestamp = Date.now();
  const tsHex = timestamp.toString(16).padStart(12, "0");

  // 무작위 10바이트 생성
  const randomBytes = new Uint8Array(10);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(randomBytes);
  } else {
    for (let i = 0; i < 10; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256);
    }
  }

  const rHex = Array.from(randomBytes, (b) => b.toString(16).padStart(2, "0")).join("");

  const part1 = tsHex.slice(0, 8);
  const part2 = tsHex.slice(8, 12);
  const part3 = "7" + rHex.slice(0, 3); // Version 7
  const part4 = ((parseInt(rHex.slice(3, 4), 16) & 0x3) | 0x8).toString(16) + rHex.slice(4, 7); // Variant
  const part5 = rHex.slice(7, 19);

  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
};

/**
 * UUID v7 문자열에서 생성 타임스탬프(ms)를 추출합니다.
 */
export const getTimestampFromUUIDv7 = (uuid: string): number | null => {
  const clean = uuid.replace(/-/g, "");
  if (clean.length !== 32) return null;
  if (clean[12] !== "7") return null; // UUID v7이 아님

  const tsHex = clean.slice(0, 12);
  const timestamp = parseInt(tsHex, 16);
  return isNaN(timestamp) ? null : timestamp;
};

/**
 * UUID v7이 만료되었는지 검증합니다.
 */
export const isUUIDv7Expired = (uuid: string, maxAgeMs: number): boolean => {
  const ts = getTimestampFromUUIDv7(uuid);
  if (ts === null) return true; // 올바르지 않은 v7이면 만료(무효)로 처리
  return Date.now() - ts > maxAgeMs;
};
