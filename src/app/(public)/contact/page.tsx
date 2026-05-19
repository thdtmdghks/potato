import Link from "next/link";

const contactInfo = [
  { label: "주소", value: "서울시 강남구 테헤란로 123, 4층" },
  { label: "전화", value: "02-1234-5678" },
  { label: "이메일", value: "contact@example.com" },
  { label: "영업시간", value: "평일 09:00 – 18:00 (주말·공휴일 휴무)" },
];

export default function Contact() {
  return (
    <>
      <h1 className="text-navy text-3xl font-bold dark:text-white">연락처</h1>

      <section className="mt-8">
        <h2 className="text-navy text-xl font-semibold dark:text-white">연락처 정보</h2>
        <dl className="mt-4 space-y-3">
          {contactInfo.map((c) => (
            <div key={c.label} className="flex gap-4">
              <dt className="text-navy w-20 shrink-0 font-medium dark:text-gray-200">{c.label}</dt>
              <dd className="text-gray-dark dark:text-gray-300">{c.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="text-navy text-xl font-semibold dark:text-white">오시는 길</h2>
        <div className="bg-gray-light text-gray-dark mt-4 flex h-64 items-center justify-center rounded-lg dark:bg-gray-800 dark:text-gray-500">
          지도 영역 (도메인 확정 후 실제 지도 삽입)
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h2 className="text-navy text-lg font-semibold dark:text-white">프로젝트 문의</h2>
        <p className="text-gray-dark mt-2 text-sm dark:text-gray-300">
          프로젝트에 대해 상담받고 싶으시면 견적문의를 이용해주세요.
        </p>
        <Link
          href="/inquiry"
          className="bg-navy hover:bg-navy-light mt-4 inline-block rounded-lg px-6 py-2 text-sm text-white transition-colors"
        >
          견적문의 하기
        </Link>
      </section>
    </>
  );
}
