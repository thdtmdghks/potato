export default function Footer() {
  return (
    <footer className="bg-navy-dark text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="font-bold text-white text-lg">경산창호</h3>
            <p className="mt-2 text-sm">경산·대구 샷시 전문 시공</p>
            <p className="mt-1 text-sm">40년 경력 · 당일 시공 가능</p>
          </div>
          <div>
            <h3 className="font-bold text-white">연락처</h3>
            <p className="mt-2 text-sm">📞 010-3812-9922</p>
            <p className="mt-1 text-sm">📍 경산시 원효로40길 64-8</p>
            <p className="mt-1 text-sm">🕐 매주 일요일 휴무</p>
          </div>
          <div>
            <h3 className="font-bold text-white">시공 안내</h3>
            <p className="mt-2 text-sm">하이샷시 · 방충망 · 유리교체</p>
            <p className="mt-1 text-sm">ABS도어 · 방범창</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-600 pt-4 text-center text-sm">
          <p>© {new Date().getFullYear()} 경산창호. 대표 송정관.</p>
        </div>
      </div>
    </footer>
  );
}
