const SKELETON_COUNT = 3;

export function ReviewCarouselSkeleton() {
  return (
    <section className="border-t border-gray-100 bg-gray-50/30 py-20 dark:border-gray-800 dark:bg-gray-950/10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="bg-gray-light mx-auto h-7 w-32 animate-pulse rounded dark:bg-gray-800" />
        <div className="bg-gray-light mx-auto mt-2 h-4 w-64 animate-pulse rounded dark:bg-gray-800" />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="bg-gray-light h-40 animate-pulse rounded-xl dark:bg-gray-800" />
          ))}
        </div>
      </div>
    </section>
  );
}
