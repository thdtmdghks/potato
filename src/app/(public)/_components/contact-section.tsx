import Image from "next/image";
import { BUSINESS, LINKS } from "@/shared/constants";

export function ContactSection() {
  return (
    <section id="contact" className="bg-gray-50 py-16 dark:bg-gray-900/50">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-navy text-center text-2xl font-bold dark:text-white">상담·견적 문의</h2>
        <p className="text-gray-dark mt-2 text-center text-sm dark:text-gray-400">
          전화 한 통이면 빠른 견적 상담 가능합니다
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <dl className="space-y-3">
              <div className="flex gap-3">
                <dt className="text-navy w-16 shrink-0 font-medium dark:text-gray-200">주소</dt>
                <dd className="text-gray-dark dark:text-gray-300">{BUSINESS.address}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-navy w-16 shrink-0 font-medium dark:text-gray-200">전화</dt>
                <dd>
                  <a href={LINKS.tel} className="text-accent hover:underline">
                    {BUSINESS.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-navy w-16 shrink-0 font-medium dark:text-gray-200">영업</dt>
                <dd className="text-gray-dark dark:text-gray-300">{BUSINESS.closedDay}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-navy w-16 shrink-0 font-medium dark:text-gray-200">대표</dt>
                <dd className="text-gray-dark dark:text-gray-300">{BUSINESS.owner}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3 pt-4">
              <a
                href={LINKS.tel}
                className="bg-accent hover:bg-accent-dark rounded-lg px-5 py-2.5 font-semibold text-white transition-colors"
              >
                📞 전화
              </a>
              <a
                href={LINKS.sms}
                className="bg-navy hover:bg-navy-light rounded-lg px-5 py-2.5 font-semibold text-white transition-colors"
              >
                💬 문자
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <a
              href={LINKS.naverMap}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <Image
                src="/place.webp"
                alt={`${BUSINESS.name} 위치 지도`}
                width={800}
                height={256}
                className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-gray-800 shadow-md backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-100">
                  🔍 네이버 지도로 자세히 보기
                </span>
              </div>
            </a>
            <a
              href={LINKS.naverMap}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              💚 네이버 지도에서 길찾기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
