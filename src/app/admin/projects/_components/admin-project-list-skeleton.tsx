const SKELETON_COUNT = 4;

export function AdminProjectListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex gap-4">
            <div className="bg-gray-light h-20 w-28 shrink-0 rounded-lg dark:bg-gray-800" />
            <div className="flex-1 space-y-2">
              <div className="bg-gray-light h-5 w-48 rounded dark:bg-gray-800" />
              <div className="bg-gray-light h-4 w-32 rounded dark:bg-gray-800" />
              <div className="bg-gray-light h-3 w-24 rounded dark:bg-gray-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
