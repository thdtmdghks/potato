export function ReviewDetailSkeleton() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="bg-gray-light h-4 w-32 animate-pulse rounded dark:bg-gray-800" />
      <div className="mt-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-gray-light h-12 w-12 animate-pulse rounded-full dark:bg-gray-800" />
          <div className="space-y-1.5">
            <div className="bg-gray-light h-5 w-24 animate-pulse rounded dark:bg-gray-800" />
            <div className="bg-gray-light h-3 w-16 animate-pulse rounded dark:bg-gray-800" />
          </div>
        </div>
        <div className="bg-gray-light h-6 w-32 animate-pulse rounded dark:bg-gray-800" />
        <div className="bg-gray-light h-24 w-full animate-pulse rounded dark:bg-gray-800" />
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-light aspect-square animate-pulse rounded-lg dark:bg-gray-800" />
          <div className="bg-gray-light aspect-square animate-pulse rounded-lg dark:bg-gray-800" />
        </div>
      </div>
    </main>
  );
}
