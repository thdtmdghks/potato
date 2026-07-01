const SKELETON_COUNT = 4;

export function ReviewListSkeleton() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="bg-gray-light h-48 w-full animate-pulse dark:bg-gray-800" />
          <div className="space-y-3 p-5">
            <div className="bg-gray-light h-4 w-24 animate-pulse rounded dark:bg-gray-800" />
            <div className="bg-gray-light h-12 w-full animate-pulse rounded dark:bg-gray-800" />
            <div className="flex items-center justify-between pt-2">
              <div className="bg-gray-light h-6 w-20 animate-pulse rounded-full dark:bg-gray-800" />
              <div className="bg-gray-light h-3 w-16 animate-pulse rounded dark:bg-gray-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
