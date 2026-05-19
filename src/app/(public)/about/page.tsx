const history = [
  { year: "2020", event: "회사 설립" },
  { year: "2021", event: "첫 번째 대형 프로젝트 수주" },
  { year: "2022", event: "디자인 부문 확장" },
  { year: "2023", event: "앱 개발 서비스 런칭" },
  { year: "2024", event: "누적 프로젝트 100건 달성" },
];

export default function About() {
  return (
    <>
      <h1 className="text-navy text-3xl font-bold dark:text-white">회사소개</h1>

      <section className="mt-8">
        <h2 className="text-navy text-xl font-semibold dark:text-white">비전</h2>
        <p className="text-gray-dark mt-2 dark:text-gray-300">
          기술과 디자인의 융합으로 비즈니스의 디지털 전환을 이끕니다. 소규모 기업부터 중견기업까지,
          각 비즈니스에 최적화된 솔루션을 제공합니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-navy text-xl font-semibold dark:text-white">핵심 가치</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "품질",
              description: "검증된 기술 스택과 철저한 테스트로 안정적인 서비스를 제공합니다.",
            },
            {
              title: "소통",
              description: "프로젝트 전 과정에서 투명한 커뮤니케이션을 유지합니다.",
            },
            { title: "성장", description: "고객의 비즈니스 성장이 곧 우리의 성장입니다." },
          ].map((v) => (
            <li
              key={v.title}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <h3 className="text-navy font-semibold dark:text-white">{v.title}</h3>
              <p className="text-gray-dark mt-1 text-sm dark:text-gray-300">{v.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-navy text-xl font-semibold dark:text-white">연혁</h2>
        <ol className="border-navy mt-4 space-y-3 border-l-2 pl-6 dark:border-gray-600">
          {history.map((h) => (
            <li key={h.year}>
              <span className="text-navy font-semibold dark:text-blue-400">{h.year}</span>
              <span className="text-gray-dark ml-2 dark:text-gray-300">{h.event}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
