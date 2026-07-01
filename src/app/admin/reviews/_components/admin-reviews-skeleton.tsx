const SKELETON_COUNT = 3;

export function AdminReviewsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-light h-7 w-40 animate-pulse rounded dark:bg-gray-800" />
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gray-light h-10 w-10 rounded-full dark:bg-gray-800" />
            <div className="space-y-1.5">
              <div className="bg-gray-light h-4 w-24 rounded dark:bg-gray-800" />
              <div className="bg-gray-light h-3 w-16 rounded dark:bg-gray-800" />
            </div>
          </div>
          <div className="bg-gray-light mt-3 h-16 w-full rounded dark:bg-gray-800" />
        </div>
      ))}
    </div>
  );
}
