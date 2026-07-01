const SKELETON_COUNT = 4;

export function DashboardStatsSkeleton() {
  return (
    <section>
      <div className="bg-gray-light mb-4 h-6 w-12 animate-pulse rounded dark:bg-gray-800" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div key={i} className="bg-gray-light h-14 animate-pulse rounded-xl dark:bg-gray-800" />
        ))}
      </div>
    </section>
  );
}
