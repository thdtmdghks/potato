export const SITE_URL = "https://potato-swart.vercel.app";

export const BUSINESS = {
  name: "경산창호",
  owner: "송정관",
  phone: "010-3812-9922",
  address: "경산시 원효로40길 64-8",
  region: "경산·대구",
  closedDay: "매주 일요일 휴무",
  since: "2014",
  slogan: "경산·대구 샤시 전문 시공",
  description:
    "샤시(샷시) 전문 시공. 하이샤시, 방충망, 유리, ABS도어, 방범창. 경산·대구 당일시공 가능.",
} as const;

export const LINKS = {
  tel: `tel:${BUSINESS.phone}`,
  sms: `sms:${BUSINESS.phone}`,
  kakao: "#", // TODO: 카카오톡 채널 URL
  map: `https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.address)}&output=embed`,
} as const;
