const SKELETON_COUNT = 4;

export function ProjectCarouselSkeleton() {
  return (
    <section className="pt-20 pb-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="bg-gray-light mx-auto h-7 w-24 animate-pulse rounded dark:bg-gray-800" />
        <div className="bg-gray-light mx-auto mt-2 h-4 w-48 animate-pulse rounded dark:bg-gray-800" />
      </div>
      <div className="mt-10 flex gap-2 overflow-hidden px-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-light aspect-[4/3] w-2/3 shrink-0 animate-pulse rounded-lg sm:w-1/2 md:w-1/3 lg:w-1/4 dark:bg-gray-800"
          />
        ))}
      </div>
    </section>
  );
}
