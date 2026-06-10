import Link from "next/link";
import { BUSINESS, CATEGORIES } from "@/shared/constants";
import { ROUTES } from "@/shared/routes";

export function Footer() {
  return (
    <footer className="bg-navy-dark text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-white">{BUSINESS.name}</h3>
            <p className="mt-2 text-sm">{BUSINESS.slogan}</p>
            <p className="mt-1 text-sm">2014~ 운영</p>
          </div>
          <div>
            <h3 className="font-bold text-white">연락처</h3>
            <p className="mt-2 text-sm">📞 {BUSINESS.phone}</p>
            <p className="mt-1 text-sm">📍 {BUSINESS.address}</p>
            <p className="mt-1 text-sm">🕐 {BUSINESS.closedDay}</p>
          </div>
          <div>
            <h3 className="font-bold text-white">하는 일</h3>
            <p className="mt-2 text-sm">{CATEGORIES.join(" · ")}</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-600 pt-4 text-center text-sm">
          <p>
            © {new Date().getFullYear()} {BUSINESS.name}. 대표 {BUSINESS.owner}.
          </p>
          <div className="mt-2 flex justify-center gap-3 text-xs text-gray-600">
            <Link href={ROUTES.privacy} className="hover:text-gray-400">
              개인정보 처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
