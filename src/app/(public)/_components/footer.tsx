import Link from "next/link";
import { BUSINESS } from "@/shared/constants";

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-white">{BUSINESS.name}</h3>
            <p className="mt-2 text-sm">{BUSINESS.slogan}</p>
            <p className="mt-1 text-sm">{BUSINESS.experience} 경력 · 당일 시공 가능</p>
          </div>
          <div>
            <h3 className="font-bold text-white">연락처</h3>
            <p className="mt-2 text-sm">📞 {BUSINESS.phone}</p>
            <p className="mt-1 text-sm">📍 {BUSINESS.address}</p>
            <p className="mt-1 text-sm">🕐 {BUSINESS.closedDay}</p>
          </div>
          <div>
            <h3 className="font-bold text-white">시공 안내</h3>
            <p className="mt-2 text-sm">하이샷시 · 방충망 · 유리교체</p>
            <p className="mt-1 text-sm">ABS도어 · 방범창</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-600 pt-4 text-center text-sm">
          <p>
            © {new Date().getFullYear()} {BUSINESS.name}. 대표 {BUSINESS.owner}.
          </p>
          <Link
            href="/admin"
            className="mt-2 inline-block text-xs text-gray-600 hover:text-gray-400"
          >
            관리자
          </Link>
        </div>
      </div>
    </footer>
  );
}
