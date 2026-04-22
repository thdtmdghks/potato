import Link from "next/link";

export default function Home() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl font-bold text-navy">서비스 홈페이지</h1>
      <p className="mt-4 text-gray-dark">서비스 설명</p>
      <Link
        href="/inquiry"
        className="mt-8 inline-block rounded-lg bg-navy px-8 py-3 text-white hover:bg-navy-light"
      >
        견적문의
      </Link>
    </div>
  );
}
