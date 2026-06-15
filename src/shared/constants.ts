export const SITE_URL = "https://potato-swart.vercel.app";
export const REVIEW_INVITE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7일

export const BUSINESS = {
  name: "경산창호",
  owner: "송정관",
  phone: "010-3812-9922",
  address: "경산시 원효로40길 64-8",
  region: "경산 대구",
  closedDay: "매주 일요일 휴무",
  since: "2014",
  slogan: "경산 대구 샤시 전문 시공",
  description:
    "경산 대구 샤시(샷시) 창호 전문 시공 업체. 하이샤시, 방충망 교체, 복층유리, ABS도어, 방범창 당일 시공 가능.",
} as const;

export const LINKS = {
  tel: `tel:${BUSINESS.phone}`,
  sms: `sms:${BUSINESS.phone}`,
  kakao: "#", // TODO: 카카오톡 채널 URL
  map: `https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.address)}&output=embed`,
  naverMap: `https://map.naver.com/p/entry/place/37416233`,
} as const;

export const CATEGORIES = [
  "하이샤시",
  "방충망",
  "유리",
  "ABS도어",
  "방범창",
  "잡철",
  "방화문",
  "스텐",
  "판넬",
] as const;

export const REGION_CONFIG = {
  CITIES: ["경산", "대구"],
  DEFAULT_CITY: "경산",
  CLEAN_REGEXP: /^(경산시|대구광역시|경산|대구)\s*/,
} as const;

export const BUILDING_TYPES = ["아파트", "빌라", "상가", "단독주택", "공장", "기타"] as const;

export const PROJECT_CONFIG = {
  MAX_IMAGES: 20,
} as const;

export const SEO_CONFIG = {
  DESCRIPTION_MIN_LENGTH: 110,
  DESCRIPTION_MAX_LENGTH: 150,
} as const;

export const AI_CONFIG = {
  PROVIDERS: {
    GEMINI: "gemini",
    OPENAI: "openai",
  },
  DEFAULT_MODELS: {
    GEMINI: "gemini-2.5-flash",
    OPENAI: "gpt-4o-mini",
  },
  PARAMETERS: {
    MAX_TOKENS: 400,
    TEMPERATURE: 0.7,
  },
  API_URLS: {
    GEMINI: "https://generativelanguage.googleapis.com/v1beta/models",
    OPENAI: "https://api.openai.com/v1/chat/completions",
  },
} as const;

export const AI_GOOD_EXAMPLE = {
  INPUT:
    "대구 아파트, 하이샤시, 낡은 샤시 철거, 발코니 문 단열 보강, KCC 하이샤시, (연한 우드패턴 이중창 사진 첨부)",
  OUTPUT_WITHOUT_SIGNATURE:
    "대구 신암동 아파트 하이샤시 교체 사례입니다. 낡은 샤시를 철거하고 KCC 하이샤시로 새로 시공했습니다. 사진처럼 연한 우드패턴 프레임의 이중창과 복층유리로 외부 소음과 찬 바람을 줄여드렸습니다. 특히 발코니로 나가는 문에 단열을 더 튼튼하게 보강했습니다.",
  get OUTPUT_WITH_SIGNATURE() {
    return `${this.OUTPUT_WITHOUT_SIGNATURE}\n- ${BUSINESS.name}`;
  },
} as const;

export const REVIEW_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  DELETED: "deleted",
} as const;

export const PROJECT_STATUS = {
  ACTIVE: "active",
  DELETED: "deleted",
} as const;

export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];

export const USER_ROLE = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
