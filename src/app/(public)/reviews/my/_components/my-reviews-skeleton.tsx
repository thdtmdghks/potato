const SKELETON_COUNT = 3;

export function MyReviewsSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50/50 px-4 py-12 dark:bg-black">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="bg-gray-light h-8 w-40 animate-pulse rounded dark:bg-gray-800" />
        <div className="bg-gray-light h-4 w-64 animate-pulse rounded dark:bg-gray-800" />
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="bg-gray-light h-5 w-24 rounded dark:bg-gray-800" />
            <div className="bg-gray-light mt-3 h-16 w-full rounded dark:bg-gray-800" />
            <div className="bg-gray-light mt-3 h-4 w-32 rounded dark:bg-gray-800" />
          </div>
        ))}
      </div>
    </main>
  );
}
